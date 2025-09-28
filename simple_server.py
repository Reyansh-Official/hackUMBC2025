import http.server
import json
import socketserver
import os
from urllib.parse import urlparse, parse_qs

# Mock data
users = {
    "user@example.com": {"password": "password123", "name": "Demo User", "id": "1"}
}

sessions = {}

modules = [
    {
        "id": "1",
        "title": "Introduction to Financial Literacy",
        "description": "Learn the basics of financial literacy and why it matters.",
        "progress": 75,
        "topics": ["Budgeting", "Saving", "Credit Basics"]
    },
    {
        "id": "2",
        "title": "Investing Fundamentals",
        "description": "Understand how investing works and different investment options.",
        "progress": 30,
        "topics": ["Stocks", "Bonds", "Mutual Funds"]
    },
    {
        "id": "3",
        "title": "Debt Management",
        "description": "Learn strategies to manage and reduce debt effectively.",
        "progress": 0,
        "topics": ["Credit Cards", "Student Loans", "Debt Reduction"]
    }
]

badges = [
    {
        "id": "1",
        "name": "Budgeting Master",
        "description": "Completed the budgeting module with a perfect score",
        "image": "🏆"
    },
    {
        "id": "2",
        "name": "Savings Champion",
        "description": "Saved your first virtual $1,000",
        "image": "💰"
    },
    {
        "id": "3",
        "name": "Investment Guru",
        "description": "Successfully completed all investment modules",
        "image": "📈"
    }
]

class FinScholarsHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path
        
        # Serve static files
        if path == "/" or not path.startswith("/api/"):
            # Redirect root to homepage.html
            if path == "/":
                self.send_response(301)
                self.send_header("Location", "/homepage.html")
                self.end_headers()
                return
                
            # Handle direct HTML page requests
            if path in ["/login.html", "/signup.html", "/dashboard.html", "/profile.html", "/index.html", "/homepage.html"]:
                self.path = path
                return super().do_GET()
                
            # Handle other static files
            return super().do_GET()
        
        # API endpoints
        if path == "/api/modules":
            self.send_json_response(modules)
        elif path == "/api/badges":
            self.send_json_response(badges)
        elif path == "/api/user/profile":
            token = self.headers.get("Authorization", "").replace("Bearer ", "")
            if token in sessions:
                user_id = sessions[token]
                user_data = next((u for u in users.values() if u["id"] == user_id), None)
                if user_data:
                    self.send_json_response({
                        "id": user_data["id"],
                        "name": user_data["name"],
                        "email": next((email for email, data in users.items() if data["id"] == user_id), ""),
                        "badges": badges[:2],  # Mock: user has first two badges
                        "progress": {
                            "completedModules": 1,
                            "totalModules": len(modules)
                        }
                    })
                    return
            self.send_error_response("Unauthorized", 401)
        else:
            self.send_error_response("Not found", 404)
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        
        try:
            data = json.loads(post_data) if post_data else {}
        except json.JSONDecodeError:
            self.send_error_response("Invalid JSON", 400)
            return
        
        if path == "/api/auth/login":
            email = data.get("email", "")
            password = data.get("password", "")
            
            if email in users and users[email]["password"] == password:
                token = f"token_{users[email]['id']}"
                sessions[token] = users[email]["id"]
                self.send_json_response({"token": token, "user": {"name": users[email]["name"], "id": users[email]["id"]}})
            else:
                self.send_error_response("Invalid credentials", 401)
        
        elif path == "/api/auth/signup":
            email = data.get("email", "")
            password = data.get("password", "")
            name = data.get("name", "")
            
            if not email or not password or not name:
                self.send_error_response("Missing required fields", 400)
                return
                
            if email in users:
                self.send_error_response("User already exists", 409)
                return
                
            user_id = str(len(users) + 1)
            users[email] = {"password": password, "name": name, "id": user_id}
            token = f"token_{user_id}"
            sessions[token] = user_id
            self.send_json_response({"token": token, "user": {"name": name}})
        
        elif path == "/api/generate-module":
            user_id = data.get("user_id")
            topic = data.get("topic", "personal finance")
            level = data.get("level", "Basic")
            
            # Generate personalized module content
            module_id = str(len(modules) + 1)
            
            # Create personalized module
            personalized_module = {
                "id": module_id,
                "title": f"Personalized {topic.title()} Module",
                "description": f"AI-generated content about {topic} tailored to your learning style and preferences.",
                "progress": 0,
                "topics": [
                    f"Introduction to {topic.title()}",
                    f"Key Concepts in {topic.title()}",
                    f"Practical Applications of {topic.title()}",
                    f"Advanced Strategies in {topic.title()}"
                ]
            }
            
            # Add to modules
            modules.append(personalized_module)
            
            self.send_json_response({
                "success": True,
                "module": personalized_module
            })
        
        else:
            self.send_error_response("Not found", 404)
    
    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, message, status):
        self.send_json_response({"error": message}, status)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        
    def generate_module_content(self, topic, subtopic, level):
        """Generate AI-like content for a module section."""
        # This simulates AI-generated content
        return f"""
            <p>This is personalized AI-generated content about <strong>{topic}</strong> focusing on <strong>{subtopic}</strong> at a <strong>{level}</strong> level.</p>
            <p>The content is tailored specifically to your learning style and preferences.</p>
            <ul>
                <li>Key point 1 about {topic} {subtopic}</li>
                <li>Key point 2 about {topic} {subtopic}</li>
                <li>Key point 3 about {topic} {subtopic}</li>
            </ul>
            <p>This module includes practical examples and exercises to help you master {topic}.</p>
        """
    
    def generate_quiz(self, topic, level):
        """Generate a quiz for a module."""
        # This simulates AI-generated quiz
        return {
            "questions": [
                {
                    "question": f"What is the most important concept in {topic}?",
                    "options": [
                        "Option A - Personalized for you",
                        "Option B - Personalized for you",
                        "Option C - Personalized for you",
                        "Option D - Personalized for you"
                    ],
                    "correct_answer": 0
                },
                {
                    "question": f"How can you apply {topic} in real life?",
                    "options": [
                        "Option A - Personalized for you",
                        "Option B - Personalized for you",
                        "Option C - Personalized for you",
                        "Option D - Personalized for you"
                    ],
                    "correct_answer": 1
                },
                {
                    "question": f"What strategy works best for {topic} at {level} level?",
                    "options": [
                        "Option A - Personalized for you",
                        "Option B - Personalized for you",
                        "Option C - Personalized for you",
                        "Option D - Personalized for you"
                    ],
                    "correct_answer": 2
                }
            ]
        }

def run_server(port=8000, directory=None):
    if directory:
        os.chdir(directory)
    
    handler = FinScholarsHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving at http://localhost:{port}")
        httpd.serve_forever()

if __name__ == "__main__":
    # Serve frontend files from the finscholars directory
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "1. front-end/finscholars")
    run_server(8080, frontend_dir)