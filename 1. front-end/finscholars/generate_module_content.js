// Module definitions
const moduleDefinitions = [
    {
        id: "intro_to_finance",
        title: "Introduction to Finance",
        description: "Learn the fundamental concepts and principles of finance",
        level: "Basic",
        submodules: [
            {
                id: "finance_basics",
                title: "Finance Fundamentals",
                content: `
                    <h3>What is Finance?</h3>
                    <p>Finance is the study of money management and the process of acquiring needed funds. It encompasses the dynamics of assets and liabilities over time under conditions of different degrees of uncertainty and risk.</p>
                    
                    <h3>Key Areas of Finance</h3>
                    <ul>
                        <li><strong>Personal Finance</strong>: Managing individual or family financial resources, including budgeting, saving, investing, and planning for retirement</li>
                        <li><strong>Corporate Finance</strong>: Financial activities related to running a corporation, such as capital investment decisions and financing strategies</li>
                        <li><strong>Public Finance</strong>: Government activities related to taxation, spending, budgeting, and debt issuance</li>
                        <li><strong>Financial Markets</strong>: Systems and institutions where securities, commodities, and other financial instruments are traded</li>
                    </ul>
                    
                    <h3>Importance of Financial Literacy</h3>
                    <p>Financial literacy is crucial for:</p>
                    <ul>
                        <li>Making informed financial decisions</li>
                        <li>Building and protecting wealth</li>
                        <li>Achieving financial independence</li>
                        <li>Preparing for unexpected expenses and emergencies</li>
                        <li>Planning for major life events and retirement</li>
                    </ul>
                `
            },
            {
                id: "time_value_money",
                title: "Time Value of Money",
                content: `
                    <h3>Understanding the Time Value of Money</h3>
                    <p>The time value of money is a fundamental financial concept based on the idea that money available today is worth more than the same amount in the future due to its potential earning capacity.</p>
                    
                    <h3>Key Concepts</h3>
                    <ul>
                        <li><strong>Present Value (PV)</strong>: The current worth of a future sum of money at a specified rate of return</li>
                        <li><strong>Future Value (FV)</strong>: The value of an asset or cash at a specified date in the future, based on an assumed growth rate</li>
                        <li><strong>Compound Interest</strong>: Interest calculated on the initial principal and also on the accumulated interest over previous periods</li>
                        <li><strong>Discounting</strong>: The process of determining the present value of a future amount</li>
                    </ul>
                    
                    <h3>Applications in Financial Decision-Making</h3>
                    <p>The time value of money concept is applied in:</p>
                    <ul>
                        <li>Investment evaluation and comparison</li>
                        <li>Loan and mortgage calculations</li>
                        <li>Retirement planning</li>
                        <li>Business valuation</li>
                        <li>Capital budgeting decisions</li>
                    </ul>
                    
                    <h3>The Power of Compound Interest</h3>
                    <p>Compound interest can significantly impact wealth accumulation over time. For example, $1,000 invested at 8% annual interest would grow to approximately $4,661 after 20 years through the power of compounding.</p>
                `
            },
            {
                id: "financial_planning",
                title: "Financial Planning Basics",
                content: `
                    <h3>What is Financial Planning?</h3>
                    <p>Financial planning is the process of setting goals, developing strategies, and making decisions to achieve financial objectives. It involves creating a comprehensive evaluation of one's current financial state and future expectations.</p>
                    
                    <h3>Components of a Financial Plan</h3>
                    <ul>
                        <li><strong>Budgeting</strong>: Tracking income and expenses to ensure spending aligns with financial goals</li>
                        <li><strong>Emergency Fund</strong>: Saving 3-6 months of expenses for unexpected situations</li>
                        <li><strong>Debt Management</strong>: Strategies for reducing and eliminating high-interest debt</li>
                        <li><strong>Insurance Coverage</strong>: Protecting against financial risks through appropriate insurance policies</li>
                        <li><strong>Investment Strategy</strong>: Allocating resources to achieve long-term financial goals</li>
                        <li><strong>Retirement Planning</strong>: Ensuring financial security during retirement years</li>
                        <li><strong>Estate Planning</strong>: Arranging for the management and disposal of assets after death</li>
                    </ul>
                    
                    <h3>The Financial Planning Process</h3>
                    <ol>
                        <li>Establish financial goals (short-term, medium-term, and long-term)</li>
                        <li>Gather relevant financial information</li>
                        <li>Analyze current financial situation</li>
                        <li>Develop a comprehensive financial plan</li>
                        <li>Implement the financial plan</li>
                        <li>Monitor progress and make adjustments as needed</li>
                    </ol>
                    
                    <h3>Benefits of Financial Planning</h3>
                    <p>Effective financial planning helps individuals:</p>
                    <ul>
                        <li>Gain control over their financial situation</li>
                        <li>Reduce financial stress and anxiety</li>
                        <li>Make informed financial decisions</li>
                        <li>Prepare for life transitions and unexpected events</li>
                        <li>Build and preserve wealth over time</li>
                    </ul>
                `
            },
            // Add a missing closing bracket and curly brace for the intro_to_finance module
        ],
        quiz: {
            questions: [
                {
                    id: "q1",
                    type: "mcq",
                    question: "Which of the following is NOT one of the key areas of finance?",
                    options: [
                        "Personal Finance",
                        "Corporate Finance",
                        "Recreational Finance",
                        "Public Finance"
                    ],
                    correct_answer: 2,
                    explanation: "Recreational Finance is not a recognized area of finance. The main areas include Personal Finance, Corporate Finance, Public Finance, and Financial Markets."
                },
                {
                    id: "q2",
                    type: "mcq",
                    question: "What is the time value of money based on?",
                    options: [
                        "The idea that money loses value during economic recessions",
                        "The concept that money today is worth more than the same amount in the future",
                        "The theory that money should only be invested in time-sensitive assets",
                        "The principle that time is more valuable than money"
                    ],
                    correct_answer: 1,
                    explanation: "The time value of money is based on the concept that money available today is worth more than the same amount in the future due to its potential earning capacity."
                },
                {
                    id: "q3",
                    type: "mcq",
                    question: "What is compound interest?",
                    options: [
                        "Interest calculated only on the initial principal",
                        "Interest that compounds economic growth nationally",
                        "Interest calculated on the initial principal and accumulated interest from previous periods",
                        "A type of interest that only banks can access"
                    ],
                    correct_answer: 2,
                    explanation: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods, allowing your money to grow faster over time."
                },
                {
                    id: "q4",
                    type: "mcq",
                    question: "How large should an emergency fund typically be?",
                    options: [
                        "1 month of expenses",
                        "3-6 months of expenses",
                        "At least 2 years of salary",
                        "10% of annual income"
                    ],
                    correct_answer: 1,
                    explanation: "Financial experts typically recommend having an emergency fund that covers 3-6 months of expenses to handle unexpected situations like medical emergencies or job loss."
                },
                {
                    id: "q5",
                    type: "mcq",
                    question: "Which of the following is a component of financial planning?",
                    options: [
                        "Maximizing credit card usage",
                        "Avoiding all forms of insurance",
                        "Debt management",
                        "Spending all disposable income"
                    ],
                    correct_answer: 2,
                    explanation: "Debt management is an important component of financial planning, which involves strategies for reducing and eliminating high-interest debt to improve financial health."
                },
                {
                    id: "q6",
                    type: "free_text",
                    question: "Explain the concept of the time value of money and why it's important for financial decision-making.",
                    sample_answer: "The time value of money is a fundamental financial concept that recognizes money available today is worth more than the same amount in the future because of its potential earning capacity. This concept is important because it forms the basis for virtually all financial and investment decisions. It helps individuals understand why investing early is beneficial (due to compound interest), how to evaluate different investment opportunities by comparing their present values, how to determine fair loan terms, and how to plan effectively for future financial needs like retirement. Without understanding the time value of money, people might underestimate how much they need to save for future goals or fail to recognize the true cost of delayed financial decisions.",
                    key_points: [
                        "Money today is worth more than the same amount in the future",
                        "Potential earning capacity through investment",
                        "Basis for investment and financial decisions",
                        "Importance for comparing investment opportunities",
                        "Role in retirement planning",
                        "Impact of compound interest over time"
                    ]
                },
                {
                    id: "q7",
                    type: "free_text",
                    question: "Describe the components of a comprehensive financial plan and why each is important.",
                    sample_answer: "A comprehensive financial plan includes several key components that work together to create financial stability and growth. Budgeting tracks income and expenses, ensuring you live within your means and allocate money toward goals. An emergency fund provides financial security during unexpected events, preventing debt accumulation. Debt management strategies help eliminate high-interest debt that drains resources. Insurance coverage protects against catastrophic financial losses from health issues, accidents, or property damage. An investment strategy grows wealth over time through diversified assets aligned with your risk tolerance and time horizon. Retirement planning ensures financial independence in later years through consistent saving and appropriate investment vehicles. Estate planning protects your assets and ensures they're distributed according to your wishes after death. Each component addresses different aspects of financial health, working together to create short-term stability while building long-term wealth and security.",
                    key_points: [
                        "Budgeting for tracking income and expenses",
                        "Emergency fund for unexpected situations",
                        "Debt management strategies",
                        "Insurance coverage for protection",
                        "Investment strategy for growth",
                        "Retirement planning for future security",
                        "Estate planning for asset distribution"
                    ]
                }
            ]
        }
    },
    {
        id: "gen_ai_investing",
        title: "Generative AI in Investing",
        description: "Learn the fundamental concepts and principles of finance",
        level: "Basic",
        submodules: [
            {
                id: "gen_ai_intro",
                title: "Introduction to Generative AI",
                content: `
                    <h3>What is Generative AI?</h3>
                    <p>Generative AI refers to artificial intelligence systems that can create new content, including text, images, audio, and more. These systems learn patterns from existing data and generate new outputs that resemble the training data but are original creations.</p>
                    
                    <h3>Key Technologies in Generative AI</h3>
                    <ul>
                        <li><strong>Large Language Models (LLMs)</strong>: Systems like GPT-4 that can understand and generate human-like text</li>
                        <li><strong>Diffusion Models</strong>: AI systems that can create realistic images from text descriptions</li>
                        <li><strong>Generative Adversarial Networks (GANs)</strong>: Systems that pit two neural networks against each other to generate realistic outputs</li>
                    </ul>
                    
                    <h3>Applications in Finance</h3>
                    <p>Generative AI is being applied across the financial sector for:</p>
                    <ul>
                        <li>Market analysis and prediction</li>
                        <li>Risk assessment</li>
                        <li>Portfolio optimization</li>
                        <li>Personalized financial advice</li>
                        <li>Fraud detection</li>
                    </ul>
                `
            },
            {
                id: "market_analysis",
                title: "AI-Powered Market Analysis",
                content: `
                    <h3>How AI Transforms Market Analysis</h3>
                    <p>Generative AI is revolutionizing how investors analyze markets by processing vast amounts of data and identifying patterns that humans might miss.</p>
                    
                    <h3>Key Capabilities</h3>
                    <ul>
                        <li><strong>Natural Language Processing</strong>: Analyzing news, social media, and financial reports to gauge market sentiment</li>
                        <li><strong>Pattern Recognition</strong>: Identifying market trends and potential investment opportunities</li>
                        <li><strong>Predictive Analytics</strong>: Forecasting market movements based on historical data and current conditions</li>
                    </ul>
                    
                    <h3>Real-World Applications</h3>
                    <p>Investment firms are using generative AI to:</p>
                    <ul>
                        <li>Generate comprehensive market reports in seconds</li>
                        <li>Monitor global news and events that might impact investments</li>
                        <li>Create alternative data insights from non-traditional sources</li>
                        <li>Develop trading strategies based on AI-identified patterns</li>
                    </ul>
                `
            },
            {
                id: "portfolio_optimization",
                title: "AI for Portfolio Optimization",
                content: `
                    <h3>Smarter Portfolio Management</h3>
                    <p>Generative AI is helping investors build more efficient portfolios by analyzing complex relationships between assets and optimizing for various objectives.</p>
                    
                    <h3>Key Benefits</h3>
                    <ul>
                        <li><strong>Risk Management</strong>: Identifying potential risks and suggesting diversification strategies</li>
                        <li><strong>Return Optimization</strong>: Balancing portfolios to maximize returns for a given risk level</li>
                        <li><strong>Personalization</strong>: Creating custom portfolios based on individual investor goals and preferences</li>
                    </ul>
                    
                    <h3>Advanced Techniques</h3>
                    <p>Modern AI portfolio optimization includes:</p>
                    <ul>
                        <li>Multi-objective optimization considering returns, risk, ESG factors, and more</li>
                        <li>Scenario analysis to test portfolio performance under different market conditions</li>
                        <li>Dynamic rebalancing recommendations based on changing market conditions</li>
                        <li>Factor investing enhanced by AI-identified relationships</li>
                    </ul>
                `
            }
        ],
        quiz: {
            questions: [
                {
                    id: "q1",
                    type: "mcq",
                    question: "Which of the following is NOT a key technology in generative AI?",
                    options: [
                        "Large Language Models (LLMs)",
                        "Blockchain Networks",
                        "Diffusion Models",
                        "Generative Adversarial Networks (GANs)"
                    ],
                    correct_answer: 1,
                    explanation: "Blockchain Networks, while an important technology, are not specifically a generative AI technology. The other options are all key technologies in the generative AI space."
                },
                {
                    id: "q2",
                    type: "mcq",
                    question: "How does generative AI help in market analysis?",
                    options: [
                        "By replacing human analysts entirely",
                        "By processing vast amounts of data and identifying patterns",
                        "By guaranteeing investment returns",
                        "By eliminating all investment risks"
                    ],
                    correct_answer: 1,
                    explanation: "Generative AI helps in market analysis by processing vast amounts of data and identifying patterns that humans might miss. It doesn't replace human analysts entirely, guarantee returns, or eliminate risks."
                },
                {
                    id: "q3",
                    type: "mcq",
                    question: "Which of the following is a benefit of AI in portfolio optimization?",
                    options: [
                        "Guaranteed profits",
                        "Elimination of all market volatility",
                        "Personalized portfolios based on investor goals",
                        "Complete automation with no human oversight needed"
                    ],
                    correct_answer: 2,
                    explanation: "AI enables the creation of personalized portfolios based on individual investor goals and preferences. It doesn't guarantee profits, eliminate market volatility, or remove the need for human oversight."
                },
                {
                    id: "q4",
                    type: "mcq",
                    question: "What is a key capability of AI in market analysis?",
                    options: [
                        "Perfectly predicting market crashes",
                        "Natural Language Processing for analyzing news and reports",
                        "Eliminating the need for financial regulations",
                        "Replacing stock exchanges"
                    ],
                    correct_answer: 1,
                    explanation: "Natural Language Processing is a key capability that allows AI to analyze news, social media, and financial reports to gauge market sentiment. AI cannot perfectly predict crashes, eliminate regulations, or replace exchanges."
                },
                {
                    id: "q5",
                    type: "mcq",
                    question: "Which advanced technique is used in AI portfolio optimization?",
                    options: [
                        "Guaranteed return calculation",
                        "Risk elimination algorithms",
                        "Multi-objective optimization considering various factors",
                        "Market manipulation strategies"
                    ],
                    correct_answer: 2,
                    explanation: "Multi-objective optimization that considers returns, risk, ESG factors, and more is an advanced technique used in AI portfolio optimization. The other options are either impossible or unethical."
                },
                {
                    id: "q6",
                    type: "free_text",
                    question: "Explain how generative AI could potentially transform investment decision-making for individual investors.",
                    sample_answer: "Generative AI can transform investment decision-making for individual investors by providing sophisticated analysis previously available only to professionals. It can process vast amounts of market data, news, and financial reports to identify trends and opportunities, offer personalized portfolio recommendations based on individual goals and risk tolerance, and provide real-time insights on market changes. This democratizes access to advanced financial analysis, helping individual investors make more informed decisions without requiring deep financial expertise.",
                    key_points: [
                        "Democratization of sophisticated analysis",
                        "Processing vast amounts of data",
                        "Personalized recommendations",
                        "Real-time insights",
                        "Reducing the need for deep financial expertise"
                    ]
                },
                {
                    id: "q7",
                    type: "free_text",
                    question: "Describe the potential risks and limitations of relying on generative AI for investment decisions.",
                    sample_answer: "Relying on generative AI for investment decisions carries several risks and limitations. AI models may perpetuate biases present in their training data, leading to skewed investment recommendations. They lack true understanding of complex economic factors and geopolitical events that can impact markets. AI systems can't predict black swan events or unprecedented market conditions. There's also the risk of overreliance, where investors might blindly follow AI recommendations without critical evaluation. Additionally, AI models require continuous updating to remain relevant in changing market conditions, and they operate without the ethical judgment and contextual understanding that human advisors provide.",
                    key_points: [
                        "Potential for algorithmic bias",
                        "Lack of true understanding of complex factors",
                        "Inability to predict unprecedented events",
                        "Risk of overreliance/blind trust",
                        "Need for continuous updating",
                        "Absence of ethical judgment"
                    ]
                }
            ]
        }
    },
    {
        id: "personal_finance",
        title: "Personal Finance Fundamentals",
        description: "Master the basics of personal finance and budgeting",
        level: "Basic"
    },
    {
        id: "crypto_investing",
        title: "Cryptocurrency Investing",
        description: "Learn about blockchain technology and cryptocurrency investments",
        level: "Moderate"
    }
];

// Function to get module title by ID
function getModuleTitle(moduleId) {
    const module = moduleDefinitions.find(m => m.id === moduleId);
    return module ? module.title : "Unknown Module";
}

// Initialize dashboard with modules
function initializeDashboard() {
    const modules = [
        {
            id: "gen_ai_investing",
            title: "Generative AI in Investing",
            description: "Learn the fundamental concepts and principles of finance",
            level: "Basic",
            progress: 0,
            status: "Available"
        },
        {
            id: "personal_finance",
            title: "Personal Finance Fundamentals",
            description: "Master the basics of personal finance and budgeting",
            level: "Basic",
            progress: 0,
            status: "Available"
        },
        {
            id: "crypto_investing",
            title: "Cryptocurrency Investing",
            description: "Learn about blockchain technology and cryptocurrency investments",
            level: "Moderate",
            progress: 0,
            status: "Locked"
        }
    ];

    const moduleContainer = document.getElementById('module-container');
    if (!moduleContainer) return;

    modules.forEach(module => {
        const moduleCard = document.createElement('div');
        moduleCard.className = 'module-card';
        moduleCard.dataset.status = module.status.toLowerCase();

        moduleCard.innerHTML = `
            <div class="module-card-content">
                <h3>${module.title}</h3>
                <p>${module.description}</p>
                <div class="module-meta">
                    <span class="module-level">${module.level}</span>
                    <span class="module-status">${module.status}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${module.progress}%"></div>
                </div>
            </div>
        `;

        if (module.status === "Available") {
            moduleCard.addEventListener('click', () => {
                window.location.href = `module.html?id=${module.id}`;
            });
        }

        moduleContainer.appendChild(moduleCard);
    });
}

// Display module content based on URL parameter
function displayModuleContent() {
    // Always use the intro_to_finance module
    const module = moduleDefinitions[0]; // This is the intro_to_finance module
    
    // Set module title and description if elements exist
    const titleElement = document.getElementById('module-title');
    const descElement = document.getElementById('module-description');
    const levelElement = document.getElementById('module-level');
    
    if (titleElement) titleElement.textContent = module.title;
    if (descElement) descElement.textContent = module.description;
    if (levelElement) levelElement.textContent = `Level: ${module.level}`;
    
    // Display submodules if available
    if (module.submodules && module.submodules.length > 0) {
        // Try both possible container IDs
        const contentContainer = document.getElementById('module-content') || document.getElementById('submodule-container');
        if (contentContainer) {
            contentContainer.innerHTML = ''; // Clear existing content
            
            module.submodules.forEach(submodule => {
                const submoduleElement = document.createElement('div');
                submoduleElement.className = 'content-section';
                submoduleElement.innerHTML = `
                    <h3 class="section-title">${submodule.title}</h3>
                    <div class="section-content">
                        ${submodule.content}
                    </div>
                `;
                contentContainer.appendChild(submoduleElement);
            });
            
            // Add quiz button
            const quizButton = document.createElement('button');
            quizButton.id = 'start-quiz-btn';
            quizButton.className = 'action-button';
            quizButton.textContent = 'Take Quiz';
            contentContainer.appendChild(quizButton);
            
            // Add event listener to quiz button
            quizButton.addEventListener('click', () => showQuiz(module.quiz));
        } else {
            console.error('Could not find content container element');
        }
    }
}

// Fetch module from API
function fetchModuleFromAPI(moduleId) {
    // Show loading state
    const submoduleContainer = document.getElementById('submodule-container');
    if (submoduleContainer) {
        submoduleContainer.innerHTML = '<div class="loading">Loading module content from Gemini API...</div>';
    }
    
    // In a real implementation, this would fetch from the Gemini API
    // For now, we'll use the first module as a fallback
    setTimeout(() => {
        const defaultModule = moduleDefinitions[0];
        
        // Set module title and description
        document.getElementById('module-title').textContent = defaultModule.title + " (Generated)";
        document.getElementById('module-description').textContent = defaultModule.description;
        
        // Display submodules
        if (submoduleContainer && defaultModule.submodules) {
            submoduleContainer.innerHTML = '';
            
            defaultModule.submodules.forEach(submodule => {
                const submoduleElement = document.createElement('div');
                submoduleElement.className = 'submodule';
                submoduleElement.innerHTML = `
                    <h3 class="submodule-title">${submodule.title}</h3>
                    <div class="submodule-content">
                        ${submodule.content}
                    </div>
                `;
                submoduleContainer.appendChild(submoduleElement);
            });
            
            // Set up quiz
            const quizButton = document.getElementById('start-quiz-btn');
            if (quizButton && defaultModule.quiz) {
                quizButton.style.display = 'block';
                quizButton.addEventListener('click', () => showQuiz(defaultModule.quiz));
            }
        }
    }, 1000); // Simulate API delay
}

// Show quiz modal
function showQuiz(quiz) {
    const quizModal = document.getElementById('quiz-modal');
    const quizContent = document.getElementById('quiz-content');
    const quizForm = document.getElementById('quiz-form');
    
    if (!quizModal || !quizContent || !quizForm) return;
    
    // Clear previous content
    quizForm.innerHTML = '';
    
    // Add questions to the form
    quiz.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'quiz-question';
        questionElement.dataset.id = question.id;
        questionElement.dataset.type = question.type;
        
        let questionContent = `
            <h4>${index + 1}. ${question.question}</h4>
        `;
        
        if (question.type === 'mcq') {
            questionContent += `<div class="options-container">`;
            question.options.forEach((option, optIndex) => {
                questionContent += `
                    <div class="option">
                        <input type="radio" id="${question.id}_${optIndex}" name="${question.id}" value="${optIndex}">
                        <label for="${question.id}_${optIndex}">${option}</label>
                    </div>
                `;
            });
            questionContent += `</div>`;
        } else if (question.type === 'free_text') {
            questionContent += `
                <textarea name="${question.id}" rows="4" placeholder="Type your answer here..."></textarea>
            `;
        }
        
        questionElement.innerHTML = questionContent;
        quizForm.appendChild(questionElement);
    });
    
    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'submit-quiz-btn';
    submitButton.textContent = 'Submit Answers';
    quizForm.appendChild(submitButton);
    
    // Show the modal
    quizModal.style.display = 'flex';
    
    // Handle form submission
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitQuiz(quiz, quizForm);
    });
    
    // Close button functionality
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            quizModal.style.display = 'none';
        });
    }
}

// Submit quiz answers
function submitQuiz(quiz, form) {
    const results = [];
    let score = 0;
    
    // Process each question
    quiz.questions.forEach(question => {
        const questionElement = form.querySelector(`[data-id="${question.id}"]`);
        if (!questionElement) return;
        
        let userAnswer;
        let isCorrect = false;
        let feedback = '';
        
        if (question.type === 'mcq') {
            const selectedOption = form.querySelector(`input[name="${question.id}"]:checked`);
            userAnswer = selectedOption ? parseInt(selectedOption.value) : null;
            
            if (userAnswer === question.correct_answer) {
                isCorrect = true;
                score += 1;
                feedback = 'Correct! ' + question.explanation;
            } else {
                feedback = 'Incorrect. ' + question.explanation;
            }
        } else if (question.type === 'free_text') {
            const textAnswer = form.querySelector(`textarea[name="${question.id}"]`).value;
            userAnswer = textAnswer;
            
            // For free text, we'll simulate AI evaluation with a simple check
            // In a real app, this would call an API for evaluation
            const keywordsPresent = question.key_points.filter(point => 
                textAnswer.toLowerCase().includes(point.toLowerCase())
            ).length;
            
            const percentageMatch = (keywordsPresent / question.key_points.length) * 100;
            
            if (percentageMatch >= 70) {
                isCorrect = true;
                score += 1;
                feedback = 'Good answer! You covered many of the key points.';
            } else if (percentageMatch >= 40) {
                feedback = 'Partial credit. You covered some key points, but missed others.';
                score += 0.5;
            } else {
                feedback = 'Your answer missed most of the key points. Review the material and try again.';
            }
        }
        
        results.push({
            question: question.question,
            userAnswer,
            isCorrect,
            feedback
        });
    });
    
    // Calculate percentage
    const percentage = (score / quiz.questions.length) * 100;
    
    // Display results
    showQuizResults(results, percentage);
    
    // Update user progress (in a real app, this would be saved to a database)
    if (percentage >= 80) {
        // Mark module as completed
        const urlParams = new URLSearchParams(window.location.search);
        const moduleId = urlParams.get('id');
        
        // In a real app, this would update the user's progress in the database
        console.log(`Module ${moduleId} completed with score: ${percentage}%`);
        
        // Show completion message
        const completionMessage = document.createElement('div');
        completionMessage.className = 'completion-message';
        completionMessage.innerHTML = `
            <h3>🎉 Module Completed! 🎉</h3>
            <p>You've successfully completed this module with a score of ${percentage.toFixed(1)}%.</p>
            <p>The next module has been unlocked.</p>
        `;
        
        document.getElementById('quiz-results').appendChild(completionMessage);
    }
}

// Show quiz results
function showQuizResults(results, percentage) {
    const quizResults = document.getElementById('quiz-results');
    const quizForm = document.getElementById('quiz-form');
    
    if (!quizResults || !quizForm) return;
    
    // Hide the form
    quizForm.style.display = 'none';
    
    // Clear previous results
    quizResults.innerHTML = '';
    
    // Add score summary
    const scoreSummary = document.createElement('div');
    scoreSummary.className = 'score-summary';
    scoreSummary.innerHTML = `
        <h3>Your Score: ${percentage.toFixed(1)}%</h3>
        <div class="result-progress-bar">
            <div class="result-progress" style="width: ${percentage}%"></div>
        </div>
        <p>${percentage >= 80 ? 'Congratulations! You passed the quiz.' : 'You need 80% to pass. Review the material and try again.'}</p>
    `;
    quizResults.appendChild(scoreSummary);
    
    // Add detailed feedback
    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'feedback-container';
    
    results.forEach((result, index) => {
        const resultElement = document.createElement('div');
        resultElement.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
        
        resultElement.innerHTML = `
            <h4>${index + 1}. ${result.question}</h4>
            <p><strong>Your answer:</strong> ${typeof result.userAnswer === 'number' 
                ? `Option ${String.fromCharCode(65 + result.userAnswer)}` 
                : result.userAnswer || 'No answer provided'}</p>
            <p class="feedback">${result.feedback}</p>
        `;
        
        feedbackContainer.appendChild(resultElement);
    });
    
    quizResults.appendChild(feedbackContainer);
    
    // Show the results
    quizResults.style.display = 'block';
    
    // Add retry button if failed
    if (percentage < 80) {
        const retryButton = document.createElement('button');
        retryButton.className = 'retry-quiz-btn';
        retryButton.textContent = 'Try Again';
        retryButton.addEventListener('click', () => {
            quizForm.style.display = 'block';
            quizResults.style.display = 'none';
        });
        quizResults.appendChild(retryButton);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the dashboard page
    if (document.getElementById('module-container')) {
        initializeDashboard();
    }
    
    // Check if we're on the module page
    if (document.getElementById('module-title')) {
        displayModuleContent();
    }
});

// Make functions available globally
window.moduleGenerator = {
    initializeDashboard,
    displayModuleContent,
    getModuleTitle,
    showQuiz,
    submitQuiz
};