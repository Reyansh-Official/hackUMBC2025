from flask import Flask, request, jsonify, send_file, Response, stream_with_context, session
from flask_cors import CORS
import json
import os
import threading
import uuid
import requests
import io
import tempfile
from pydub import AudioSegment
from datetime import datetime, timedelta
import sys

# Import our custom modules
from user_manager import User, get_user_manager
from session_manager import get_session_manager
from auth_manager import AuthManager
from gemini_api.client import create_client as create_gemini_client

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev_secret_key')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Configure CORS with environment-specific origins
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=CORS_ORIGINS, supports_credentials=True)  # Enable CORS with credentials

# Initialize managers
user_manager = get_user_manager()
session_manager = get_session_manager()
auth_manager = AuthManager()

# Initialize Gemini client
gemini_client = create_gemini_client()

# Schedule session cleanup
def cleanup_expired_sessions():
    session_manager.clear_expired_sessions()
    threading.Timer(3600, cleanup_expired_sessions).start()  # Run every hour

# Start the cleanup thread
cleanup_thread = threading.Timer(3600, cleanup_expired_sessions)
cleanup_thread.daemon = True
cleanup_thread.start()

# Authentication middleware
@app.before_request
def auth_middleware():
    # Skip auth for login, signup, and static routes
    if request.path.startswith('/api/user/login') or request.path.startswith('/api/user/signup'):
        return
        
    # First try to get the token from Authorization header
    auth_header = request.headers.get('Authorization')
    token = None
    
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        # Verify token with auth_manager
        user_id = auth_manager.verify_token(token)
        if user_id:
            # Store user_id for route handlers
            request.user_id = user_id
            return
        
    # If no token or invalid token, fall back to session
    session_id = session.get('session_id')
    if not session_id and request.path.startswith('/api/'):
        return jsonify({
            "success": False,
            "error": "Not authenticated"
        }), 401
        
    # Validate session and set user_id in request
    if session_id and request.path.startswith('/api/'):
        user_id = session_manager.get_user_id(session_id)
        if not user_id:
            return jsonify({
                "success": False,
                "error": "Invalid session"
            }), 401
            
        # Store user_id for route handlers
        request.user_id = user_id

@app.route('/api/user/signup', methods=['POST'])
def signup():
    """
    Register a new user
    """
    try:
        data = request.json
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({
                "success": False,
                "error": "Missing email or password"
            }), 400
            
        result = auth_manager.signup(data['email'], data['password'], data.get('user_data', {}))
        
        if result.get('error'):
            return jsonify({
                "success": False,
                "error": result['error']
            }), 400
            
        # Create session
        session_id = session_manager.create_session(result['user_id'])
        session['session_id'] = session_id
            
        # Generate token for API access
        token = auth_manager.generate_token(result['user_id'])
            
        return jsonify({
            "success": True,
            "user_id": result['user_id'],
            "session_id": session_id,
            "token": token,
            "is_new_user": True
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/user/login', methods=['POST'])
def login():
    """
    Login a user
    """
    try:
        data = request.json
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({
                "success": False,
                "error": "Missing email or password"
            }), 400
            
        result = auth_manager.login(data['email'], data['password'])
        
        if result.get('error'):
            return jsonify({
                "success": False,
                "error": result['error']
            }), 400
            
        # Create session
        session_id = session_manager.create_session(result['user_id'])
        session['session_id'] = session_id
            
        # Generate token for API access
        token = auth_manager.generate_token(result['user_id'])
            
        # Get user data
        user = user_manager.get_user(result['user_id'])
        is_new_user = not user.interests and not user.modules
            
        return jsonify({
            "success": True,
            "user_id": result['user_id'],
            "session_id": session_id,
            "token": token,
            "is_new_user": is_new_user
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/user/logout', methods=['POST'])
def logout():
    """
    Logout a user
    """
    try:
        session_id = session.get('session_id')
        if session_id:
            session_manager.delete_session(session_id)
            session.pop('session_id', None)
            
        return jsonify({
            "success": True
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/user/me', methods=['GET'])
def get_current_user():
    """
    Get current user data
    """
    try:
        session_id = session.get('session_id')
        if not session_id:
            return jsonify({
                "success": False,
                "error": "Not authenticated"
            }), 401
            
        user_id = session_manager.get_user_id(session_id)
        if not user_id:
            return jsonify({
                "success": False,
                "error": "Invalid session"
            }), 401
            
        user = user_manager.get_user(user_id)
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
            
        return jsonify({
            "success": True,
            "user": user.to_dict()
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/user/interests', methods=['POST'])
def update_user_interests():
    """
    Update user interests
    """
    try:
        session_id = session.get('session_id')
        if not session_id:
            return jsonify({
                "success": False,
                "error": "Not authenticated"
            }), 401
            
        user_id = session_manager.get_user_id(session_id)
        if not user_id:
            return jsonify({
                "success": False,
                "error": "Invalid session"
            }), 401
            
        data = request.json
        if not data or 'interests' not in data:
            return jsonify({
                "success": False,
                "error": "Missing interests"
            }), 400
            
        user = user_manager.get_user(user_id)
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
            
        user.interests = data['interests']
        user_manager.update_user(user)
            
        return jsonify({
            "success": True,
            "user": user.to_dict()
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/user/upload-syllabus', methods=['POST'])
def upload_syllabus():
    """
    Upload and process syllabus
    """
    try:
        session_id = session.get('session_id')
        if not session_id:
            return jsonify({
                "success": False,
                "error": "Not authenticated"
            }), 401
            
        user_id = session_manager.get_user_id(session_id)
        if not user_id:
            return jsonify({
                "success": False,
                "error": "Invalid session"
            }), 401
            
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file part"
            }), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No selected file"
            }), 400
            
        # Process syllabus and generate modules
        # This would call the AI service to analyze the syllabus
        # For now, we'll create a sample module
        
        user = user_manager.get_user(user_id)
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
            
        # Create a sample module
        module_id = str(uuid.uuid4())
        module = {
            "id": module_id,
            "title": "Introduction to Finance",
            "content": "<h1>Introduction to Finance</h1><p>This module covers the basics of finance.</p>",
            "created_at": datetime.now().isoformat(),
            "completion_status": 0
        }
        
        if not user.modules:
            user.modules = []
            
        user.modules.append(module)
        user_manager.update_user(user)
            
        return jsonify({
            "success": True,
            "message": "Syllabus processed successfully",
            "modules_created": 1,
            "user": user.to_dict()
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/process-syllabus', methods=['POST'])
def process_syllabus():
    """
    Process uploaded syllabus file
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "error": "Missing request data"
            }), 400
            
        # For demo purposes, return success
        return jsonify({
            "success": True,
            "message": "Syllabus processed successfully",
            "modules_created": 1
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/generate-module', methods=['POST'])
def generate_module():
    """
    Generate module content based on topic and level
    Steps:
    a. Receive topic and level (Basic/Moderate/Advanced)
    b. Call Gemini AI (Prompt 1.1) with the precise prompt for the requested level
    c. Store the generated HTML content in the modules table linked to the user
    d. Simultaneously, initiate an asynchronous job to call Gemini AI (Prompt 1.2) 
       to generate the Quiz JSON for this content, storing it in the quizzes table
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "error": "Missing request data"
            }), 400
            
        # Extract required parameters
        user_id = data.get('user_id')
        topic = data.get('topic')
        level = data.get('level', 'Basic')  # Default to Basic if not specified
        
        if not user_id or not topic:
            return jsonify({
                "success": False,
                "error": "Missing required parameters: user_id and topic"
            }), 400
            
        # Validate level
        if level not in ['Basic', 'Moderate', 'Advanced']:
            return jsonify({
                "success": False,
                "error": "Invalid level. Must be one of: Basic, Moderate, Advanced"
            }), 400
            
        # Step b: Call Gemini AI with prompt for content generation
        prompt = f"""
        You are an expert financial educator. Create comprehensive educational content about {topic} at {level} level.
        
        Requirements:
        - For Basic level: Focus on fundamental concepts, simple explanations, and everyday examples.
        - For Moderate level: Include more detailed explanations, some technical terms with definitions, and practical applications.
        - For Advanced level: Provide in-depth analysis, technical concepts, market implications, and advanced strategies.
        
        Format the response as clean HTML with:
        - Clear section headings using <h1>, <h2>, <h3> tags
        - Well-structured paragraphs using <p> tags
        - Bullet points using <ul> and <li> tags where appropriate
        - Bold important terms using <strong> tags
        - Include 2-3 real-world examples
        
        The content should be educational, accurate, and engaging.
        """
        content_response = gemini_client.generate_content(prompt)
        
        # Extract HTML content
        html_content = content_response.text if hasattr(content_response, 'text') else str(content_response)
        
        # Generate a unique module ID
        module_id = str(uuid.uuid4())
        
        # Step c: Store the generated HTML content in the modules table
        module_data = {
            "id": module_id,
            "user_id": user_id,
            "topic": topic,
            "level": level,
            "content": html_content,
            "created_at": datetime.now().isoformat(),
            "has_quiz": False  # Will be updated when quiz is generated
        }
        
        # Insert into modules table
        insert_result = supabase_client.from_table('modules').insert(module_data)
        
        if insert_result.get('error'):
            return jsonify({
                "success": False,
                "error": f"Failed to store module: {insert_result.get('error')}"
            }), 500
            
        # Step d: Initiate asynchronous job to generate quiz
        def generate_quiz_async(module_id, content, topic, level):
            try:
                # Generate quiz using Gemini AI
                quiz_prompt = f"""
                You are an expert financial educator. Create a comprehensive quiz about {topic} at {level} level based on this content:
                
                {content}
                
                Create a quiz with the following specifications:
                1. Include 5 multiple-choice questions (MCQs) with 4 options each
                2. Include 2 free-text questions that require short paragraph answers
                
                Format your response as a JSON object with this exact structure:
                {{
                  "questions": [
                    {{
                      "id": "q1",
                      "type": "mcq",
                      "question": "Question text here?",
                      "options": ["Option A", "Option B", "Option C", "Option D"],
                      "correct_answer": 0,
                      "explanation": "Explanation of the correct answer"
                    }},
                    {{
                      "id": "q2",
                      "type": "free_text",
                      "question": "Question text here?",
                      "sample_answer": "A sample correct answer to help with grading",
                      "key_points": ["Key point 1", "Key point 2", "Key point 3"]
                    }}
                  ]
                }}
                
                Ensure all questions are directly related to the content provided and appropriate for the {level} difficulty level.
                """
                quiz_response = gemini_client.generate_content(quiz_prompt)
                
                # Parse the JSON response
                response_text = quiz_response.text if hasattr(quiz_response, 'text') else str(quiz_response)
                
                # Extract the JSON part from the response
                import re
                json_match = re.search(r'({.*})', response_text, re.DOTALL)
                if json_match:
                    quiz_json = json.loads(json_match.group(1))
                else:
                    # Fallback if JSON extraction fails
                    quiz_json = {"questions": []}
                
                # Store quiz in quizzes table
                quiz_data = {
                    "id": str(uuid.uuid4()),
                    "module_id": module_id,
                    "questions": json.dumps(quiz_json.get('questions', [])),
                    "created_at": datetime.now().isoformat()
                }
                
                quiz_result = supabase_client.from_table('quizzes').insert(quiz_data)
                
                # Update module to indicate quiz is available
                if not quiz_result.get('error'):
                    supabase_client.from_table('modules').eq('id', module_id).update({"has_quiz": True})
            except Exception as e:
                print(f"Error generating quiz: {str(e)}")
        
        # Start asynchronous job
        threading.Thread(
            target=generate_quiz_async,
            args=(module_id, html_content, topic, level)
        ).start()
        
        # Return success response with module ID
        return jsonify({
            "success": True,
            "message": "Module generated successfully",
            "module_id": module_id,
            "quiz_status": "generating"
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/submit-answer', methods=['POST'])
def submit_answer():
    """
    Process quiz answer submission
    Steps:
    a. Receive module_id, question_id, and user_answer (free-text or MCQ selection)
    b. If free-text, call Gemini AI for grading and feedback
    c. If MCQ, calculate correctness locally
    d. Upon quiz completion, calculate final percentage
    e. If score ≥80%, update user progress
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "error": "Missing request data"
            }), 400
            
        # Extract required parameters
        user_id = data.get('user_id')
        module_id = data.get('module_id')
        question_id = data.get('question_id')
        user_answer = data.get('user_answer')
        question_type = data.get('question_type', 'mcq')  # Default to MCQ if not specified
        is_final_question = data.get('is_final_question', False)
        
        if not all([user_id, module_id, question_id, user_answer is not None]):
            return jsonify({
                "success": False,
                "error": "Missing required parameters: user_id, module_id, question_id, user_answer"
            }), 400
        
        # Initialize score and feedback
        score = 0
        feedback = ""
        
        # Get quiz data from database
        quiz_result = supabase_client.from_table('quizzes').eq('module_id', module_id).select('*').execute()
        
        if quiz_result.get('error'):
            return jsonify({
                "success": False,
                "error": f"Failed to retrieve quiz: {quiz_result.get('error')}"
            }), 500
            
        quiz_data = quiz_result.get('data', [{}])[0]
        questions = json.loads(quiz_data.get('questions', '[]'))
        
        # Find the current question
        current_question = None
        for question in questions:
            if question.get('id') == question_id:
                current_question = question
                break
                
        if not current_question:
            return jsonify({
                "success": False,
                "error": f"Question {question_id} not found in quiz"
            }), 404
        
        # Process answer based on question type
        if question_type == 'free_text':
            # Step b: Call Gemini AI for free-text answer evaluation
            sample_answer = current_question.get('sample_answer', '')
            key_points = current_question.get('key_points', [])
            
            # Prepare prompt for Gemini AI
            prompt = f"""
            You are an expert financial educator evaluating a student's answer.
            
            Question: {current_question.get('question', '')}
            
            Sample Correct Answer: {sample_answer}
            
            Key Points That Should Be Addressed:
            {json.dumps(key_points, indent=2)}
            
            Student Answer: {user_answer}
            
            Evaluate the student's answer and provide:
            1. A score from 0-100 based on how well they addressed the key points
            2. Constructive feedback explaining the score
            
            Format your response as a JSON object with this structure:
            {{
              "score": 85,
              "feedback": "Your feedback here"
            }}
            """
            
            # Call Gemini AI for evaluation
            evaluation_response = gemini_client.generate_content(prompt)
            
            # Parse the response
            response_text = evaluation_response.text if hasattr(evaluation_response, 'text') else str(evaluation_response)
            
            # Extract JSON from response
            import re
            json_match = re.search(r'({.*})', response_text, re.DOTALL)
            if json_match:
                evaluation_json = json.loads(json_match.group(1))
                score = evaluation_json.get('score', 70)  # Default to 70 if not found
                feedback = evaluation_json.get('feedback', 'Your answer was evaluated.')
            else:
                # Fallback if JSON extraction fails
                score = 70  # Default score
                feedback = "Your answer was evaluated but we couldn't generate detailed feedback."
            
        else:  # MCQ
            # Step c: Calculate MCQ correctness locally
            correct_answer_index = current_question.get('correct_answer', 0)
            
            # Compare user answer with correct answer
            if isinstance(user_answer, int) and user_answer == correct_answer_index:
                score = 100
                feedback = current_question.get('explanation', 'Correct answer!')
            else:
                score = 0
                options = current_question.get('options', [])
                correct_option = options[correct_answer_index] if 0 <= correct_answer_index < len(options) else "the correct option"
                feedback = f"Incorrect. The correct answer is: {correct_option}. {current_question.get('explanation', '')}"
        
        # Store the answer and score in the database
        answer_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "module_id": module_id,
            "question_id": question_id,
            "user_answer": json.dumps(user_answer),  # Store as JSON string to handle different types
            "score": score,
            "feedback": feedback,
            "created_at": datetime.now().isoformat()
        }
        
        # Insert into answers table
        answer_result = supabase_client.from_table('answers').insert(answer_data).execute()
        
        if answer_result.get('error'):
            return jsonify({
                "success": False,
                "error": f"Failed to store answer: {answer_result.get('error')}"
            }), 500
        
        # Step d: If this is the final question, calculate the final percentage
        final_result = None
        passed = False
        next_module = None
        
        if is_final_question:
            # Get all answers for this module and user
            answers_result = supabase_client.from_table('answers').eq('module_id', module_id).eq('user_id', user_id).select('score').execute()
            
            if answers_result.get('error'):
                return jsonify({
                    "success": False,
                    "error": f"Failed to retrieve answers: {answers_result.get('error')}"
                }), 500
                
            answers_data = answers_result.get('data', [])
            all_scores = [answer.get('score', 0) for answer in answers_data]
            
            if not all_scores:
                all_scores = [score]  # Use current score if no previous answers
            
            # Calculate final percentage
            final_percentage = sum(all_scores) / len(all_scores)
            
            # Step e: If score ≥80%, update user progress
            passed = final_percentage >= 80
            
            # Get module details
            module_result = supabase_client.from_table('modules').eq('id', module_id).select('*').execute()
            
            if not module_result.get('error') and module_result.get('data'):
                current_module = module_result.get('data', [{}])[0]
                topic = current_module.get('topic', '')
                current_level = current_module.get('level', 'Basic')
                
                # Determine next level
                next_level = None
                if current_level == 'Basic':
                    next_level = 'Moderate'
                elif current_level == 'Moderate':
                    next_level = 'Advanced'
                
                if passed:
                    # Update user_modules status to "Completed"
                    update_result = supabase_client.from_table('user_modules').eq('module_id', module_id).eq('user_id', user_id).update({
                        "status": "Completed",
                        "completed_at": datetime.now().isoformat(),
                        "score": final_percentage
                    }).execute()
                    
                    # If there's a next level, enable it
                    if next_level:
                        # Check if next level module exists
                        next_module_result = supabase_client.from_table('modules').eq('topic', topic).eq('level', next_level).select('id').execute()
                        
                        if not next_module_result.get('error') and next_module_result.get('data'):
                            next_module_id = next_module_result.get('data', [{}])[0].get('id')
                            
                            if next_module_id:
                                # Enable next level module
                                next_module = {
                                    "id": next_module_id,
                                    "level": next_level,
                                    "topic": topic
                                }
                                
                                # Create or update user_modules entry for next level
                                next_module_data = {
                                    "user_id": user_id,
                                    "module_id": next_module_id,
                                    "status": "Available",
                                    "unlocked_at": datetime.now().isoformat()
                                }
                                
                                supabase_client.from_table('user_modules').upsert(next_module_data).execute()
            
            # Prepare final result
            final_result = {
                "percentage": final_percentage,
                "passed": passed,
                "passing_threshold": 80,
                "next_module": next_module
            }
        
        # Return response
        return jsonify({
            "success": True,
            "question_id": question_id,
            "score": score,
            "feedback": feedback,
            "final_result": final_result
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    # Determine the next level
    next_level = None
    if current_module["level"] == "Basic":
        next_level = "Moderate"
    elif current_module["level"] == "Moderate":
        next_level = "Advanced"
                
        if next_level:
                    # Update user_progress to enable the next level
                    supabase_client.from_table('user_progress').insert({
                        "user_id": user_id,
                        "topic": current_module["topic"],
                        "level": next_level,
                        "status": "Available",
                        "created_at": datetime.now().isoformat()
                    })
        
        # Return response
        response_data = {
            "success": True,
            "score": score,
            "feedback": feedback
        }
        
        if final_percentage is not None:
            response_data["final_percentage"] = final_percentage
            response_data["passed"] = final_percentage >= 80
            
        return jsonify(response_data)
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/get-module/<module_id>', methods=['GET'])
def get_module(module_id):
    try:
        # Logic to retrieve module content would go here
        return jsonify({
            "success": True,
            "module_id": module_id
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
                    })
        
        # Return response
        response_data = {
            "success": True,
            "score": score,
            "feedback": feedback
        }
        
        if final_percentage is not None:
            response_data["final_percentage"] = final_percentage
            response_data["passed"] = final_percentage >= 80
            
        return jsonify(response_data)
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
                
                # Determine the next level
        next_level = None
        if current_module["level"] == "Basic":
                ext_level = "Moderate"
        elif current_module["level"] == "Moderate":
                    next_level = "Advanced"
                
        if next_level:
                    # Update user_progress to enable the next level
                    supabase_client.from_table('user_progress').insert({
                        "user_id": user_id,
                        "topic": current_module["topic"],
                        "level": next_level,
                        "status": "Available",
                        "created_at": datetime.now().isoformat()
                    })
        
        # Return response
        response_data = {
            "success": True,
            "score": score,
            "feedback": feedback
        }
        
        if final_percentage is not None:
            response_data["final_percentage"] = final_percentage
            response_data["passed"] = final_percentage >= 80
            
        return jsonify(response_data)
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Hugging Face TTS client for secure API integration
class HuggingFaceTTSClient:
    def __init__(self):
        # Get API URL and key from environment variables
        self.api_url = os.getenv("HUGGINGFACE_API_URL", "https://api-inference.huggingface.co/models/facebook/mms-tts-eng")
        
        # Ensure API key is set in environment variables
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")
        if not self.api_key:
            print("WARNING: HUGGINGFACE_API_KEY environment variable not set. API calls will fail.")
            self.api_key = ""
            
        # Set authorization headers with bearer token
        self.headers = {"Authorization": f"Bearer {self.api_key}"}
    
    def text_to_speech(self, text):
        """
        Convert text to speech using Hugging Face TTS API
        Returns audio data in bytes
        """
        payload = {"inputs": text}
        try:
            # Verify API key is available before making request
            if not self.api_key:
                print("Error: Missing Hugging Face API key. Set HUGGINGFACE_API_KEY environment variable.")
                return b'MISSING_API_KEY'
                
            # Make authenticated request to Hugging Face Inference API
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            
            # Check for API errors
            if response.status_code != 200:
                print(f"Hugging Face API error: {response.status_code} - {response.text}")
                return b'API_ERROR'
                
            return response.content
        except Exception as e:
            print(f"Error calling Hugging Face TTS API: {str(e)}")
            # Return error indicator for proper error handling
            return b'CONNECTION_ERROR'
    
    def convert_to_streamable(self, audio_data, format="mp3"):
        """
        Convert audio data to streamable format
        """
        # Check if we received an error indicator
        if audio_data in [b'MISSING_API_KEY', b'API_ERROR', b'CONNECTION_ERROR']:
            return audio_data
            
        try:
            # Use pydub for audio conversion if available
            if format == "mp3":
                # Convert to MP3 format
                return audio_data
            elif format == "ogg":
                # Convert to OGG format
                return audio_data
            else:
                # Default to WAV format
                return audio_data
        except Exception as e:
            print(f"Error converting audio: {str(e)}")
            return audio_data

# Initialize Hugging Face TTS client
huggingface_tts_client = HuggingFaceTTSClient()

# Hugging Face model inference client
class HuggingFaceModelClient:
    def __init__(self):
        # Get API key from environment variables
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")
        if not self.api_key:
            print("WARNING: HUGGINGFACE_API_KEY environment variable not set. Model inference will fail.")
            self.api_key = ""
            
        # Set authorization headers with bearer token
        self.headers = {"Authorization": f"Bearer {self.api_key}"}
    
    def run_inference(self, model_id, inputs, parameters=None):
        """
        Run inference on a Hugging Face model
        
        Args:
            model_id (str): The model ID on Hugging Face
            inputs (str/dict): The inputs for the model
            parameters (dict, optional): Additional parameters for the model
            
        Returns:
            dict: The model response
        """
        try:
            # Verify API key is available
            if not self.api_key:
                return {"error": "Missing Hugging Face API key"}
                
            # Prepare API URL
            api_url = f"https://api-inference.huggingface.co/models/{model_id}"
            
            # Prepare payload
            payload = {"inputs": inputs}
            if parameters:
                payload["parameters"] = parameters
                
            # Make authenticated request
            response = requests.post(api_url, headers=self.headers, json=payload)
            
            # Check for API errors
            if response.status_code != 200:
                return {"error": f"API error: {response.status_code}", "details": response.text}
                
            return response.json()
            
        except Exception as e:
            return {"error": f"Connection error: {str(e)}"}

# Initialize Hugging Face model client
huggingface_model_client = HuggingFaceModelClient()

@app.route('/api/model/inference', methods=['POST'])
def model_inference():
    """
    Run inference on a Hugging Face model
    """
    try:
        # Verify user authentication
        auth_result = auth_middleware()
        if auth_result is not None:
            return auth_result
            
        # Get request data
        data = request.json
        if not data:
            return jsonify({
                "success": False,
                "error": "Missing request data"
            }), 400
            
        # Extract parameters
        model_id = data.get('model_id')
        inputs = data.get('inputs')
        parameters = data.get('parameters')
        
        # Validate required parameters
        if not model_id:
            return jsonify({
                "success": False,
                "error": "Missing model_id parameter"
            }), 400
            
        if inputs is None:
            return jsonify({
                "success": False,
                "error": "Missing inputs parameter"
            }), 400
            
        # Run model inference
        result = huggingface_model_client.run_inference(model_id, inputs, parameters)
        
        # Check for errors
        if "error" in result:
            return jsonify({
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }), 500
            
        # Return successful response
        return jsonify({
            "success": True,
            "result": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/module-content/<module_id>', methods=['GET'])
def get_module_content(module_id):
    """
    Retrieve the text content for the specified module
    """
    try:
        # Get module content from database (mock for now)
        module_content = {
            "id": module_id,
            "topic": "personal finance",
            "level": "Basic",
            "content": "<h1>Introduction to Personal Finance</h1><p>Personal finance is the management of your money and financial decisions. It includes budgeting, saving, investing, and planning for retirement.</p>"
        }
        
        return jsonify({
            "success": True,
            "module": module_content
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/tts/<module_id>', methods=['GET'])
def text_to_speech(module_id):
    """
    Convert module content to speech and return audio file
    Steps:
    a. Retrieve the text content for the specified module
    b. Send the text to Hugging Face TTS API
    c. Convert the audio to streamable format
    d. Serve the audio file back to the frontend
    """
    try:
        # Verify user authentication
        auth_result = auth_middleware()
        if auth_result is not None:
            return auth_result
            
        # Get module content (reuse the existing endpoint logic)
        module_response = get_module_content(module_id)
        
        if isinstance(module_response, tuple):
            # Error occurred
            return module_response
        
        # Extract text content from HTML (simplified for demo)
        module_data = module_response.json['module']
        html_content = module_data.get('content', '')
        
        # Simple HTML to text conversion (in production, use a proper HTML parser)
        text_content = html_content.replace('<h1>', '').replace('</h1>', '. ').replace('<p>', '').replace('</p>', ' ')
        
        # Get audio format from query parameters (default to mp3)
        audio_format = request.args.get('format', 'mp3')
        
        # Call Hugging Face TTS API
        audio_data = huggingface_tts_client.text_to_speech(text_content)
        
        # Handle API errors
        if audio_data == b'MISSING_API_KEY':
            return jsonify({
                "success": False,
                "error": "Hugging Face API key not configured. Please set HUGGINGFACE_API_KEY environment variable."
            }), 500
        elif audio_data == b'API_ERROR':
            return jsonify({
                "success": False,
                "error": "Error from Hugging Face API. Check server logs for details."
            }), 500
        elif audio_data == b'CONNECTION_ERROR':
            return jsonify({
                "success": False,
                "error": "Connection error when calling Hugging Face API."
            }), 500
            
        # Convert to streamable format
        streamable_audio = huggingface_tts_client.convert_to_streamable(audio_data, format=audio_format)
        
        # Create a temporary file to serve
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{audio_format}')
        temp_file.write(streamable_audio)
        temp_file.close()
        
        # Set content type based on format
        content_types = {
            'mp3': 'audio/mpeg',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav'
        }
        
        # Return the audio file
        return send_file(
            temp_file.name,
            mimetype=content_types.get(audio_format, 'audio/mpeg'),
            as_attachment=True,
            download_name=f"module_{module_id}.{audio_format}"
        )
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/update-interests', methods=['POST'])
def update_interests():
    """
    Handle updating user interests and trigger module generation for new interests
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "error": "Missing request data"
            }), 400
            
        # Extract required parameters
        user_id = data.get('user_id')
        new_interests = data.get('new_interests', [])
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "Missing required parameter: user_id"
            }), 400
            
        if not new_interests or not isinstance(new_interests, list):
            return jsonify({
                "success": False,
                "error": "Missing or invalid new_interests parameter"
            }), 400
        
        # Generate modules for each new interest
        for topic in new_interests:
            # Call the generate_module endpoint for each new interest
            module_data = {
                "user_id": user_id,
                "topic": topic,
                "level": "Basic"  # Default to Basic level for new interests
            }
            
            # Use the existing generate_module function
            # We're creating a mock request object with the necessary data
            with app.test_request_context(
                '/api/generate-module',
                method='POST',
                json=module_data
            ):
                # Call the generate_module function directly
                response = generate_module()
                
                # Check if module generation was successful
                if isinstance(response, tuple) and response[1] != 200:
                    return jsonify({
                        "success": False,
                        "error": f"Failed to generate module for topic: {topic}"
                    }), 500
        
        return jsonify({
            "success": True,
            "message": f"Successfully generated modules for {len(new_interests)} new interests"
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/tts-stream/<module_id>', methods=['GET'])
def stream_tts(module_id):
    """
    Stream audio content for the specified module
    """
    try:
        # Get module content (reuse the existing endpoint logic)
        module_response = get_module_content(module_id)
        
        if isinstance(module_response, tuple):
            # Error occurred
            return module_response
        
        # Extract text content from HTML (simplified for demo)
        module_data = module_response.json['module']
        html_content = module_data.get('content', '')
        
        # Simple HTML to text conversion (in production, use a proper HTML parser)
        text_content = html_content.replace('<h1>', '').replace('</h1>', '. ').replace('<p>', '').replace('</p>', ' ')
        
        # Get audio format from query parameters (default to mp3)
        audio_format = request.args.get('format', 'mp3')
        
        # Call Hugging Face TTS API
        audio_data = huggingface_tts_client.text_to_speech(text_content)
        
        # Convert to streamable format
        streamable_audio = huggingface_tts_client.convert_to_streamable(audio_data, format=audio_format)
        
        # Set content type based on format
        content_types = {
            'mp3': 'audio/mpeg',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav'
        }
        
        # Create a generator to stream the audio data
        def generate():
            # In a real implementation, you would stream chunks of the audio
            # For simplicity in this demo, we're returning the entire audio at once
            yield streamable_audio
        
        # Return streaming response
        return Response(
            stream_with_context(generate()),
            mimetype=content_types.get(audio_format, 'audio/mpeg')
        )
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)