"""
Formal evaluation criteria, syllabus schemas, and benchmark data for Practicals 1 to 10
P. R. Pote Patil College of Engineering & Management, Amravati
Course: Artificial Intelligence (ML509PCC17)
"""

RUBRIC_CRITERIA = {
    "process_skills": {
        "max_marks": 10,
        "subcategories": {
            "logic_formation": {
                "max_marks": 5,
                "description": "Code structure, algorithmic design, state space representation, search mechanics, efficiency, and syntax cleanliness."
            },
            "engineering_practice": {
                "max_marks": 5,
                "description": "Modular functions, parameter handling, error resilience, and proper use of libraries (NumPy, Matplotlib, NetworkX, Pygame, Tkinter)."
            }
        }
    },
    "product_skills": {
        "max_marks": 10,
        "subcategories": {
            "output_authenticity": {
                "max_marks": 5,
                "description": "Verification that the execution log/trace matches code logic and state transitions without fabrication or copy-pasting from other practicals."
            },
            "scientific_deduction": {
                "max_marks": 5,
                "description": "Technical depth of written conclusion (complexity analysis, optimality, state space behavior, convergence) rather than a trivial 1-line restatement."
            }
        }
    },
    "viva_voce": {
        "max_marks": 5,
        "tiers": {
            "high": {"range": [5, 5], "description": "Satisfactory conceptual defense; explains logic, algorithmic invariants, and handles edge cases without contradiction."},
            "medium": {"range": [3, 4], "description": "Moderately satisfactory; understands execution but exhibits gaps in theoretical foundations or edge cases."},
            "low": {"range": [0, 2], "description": "Unsatisfactory; fails to explain submitted code, reveals indicators of plagiarism, or fails core questions."}
        }
    }
}

PRACTICALS_SYLLABUS = {
    1: {
        "title": "Introduction to AI & Python Libraries",
        "aim": "To study basic AI concepts and Python libraries",
        "co": "CO1 (BT Level 3, PO1, PO2, PO5)",
        "software": "Python 3.14.6 (NumPy, Pandas)",
        "key_algorithms": ["Array vectorization", "DataFrame slicing", "Eigenvalue decomposition", "Boolean masking"],
        "critical_checkpoints": ["Importing numpy and pandas", "Avoiding explicit loops for matrix operations", "DataFrame indexing correctness"]
    },
    2: {
        "title": "Data Visualization using Python",
        "aim": "To visualize data using Python",
        "co": "CO1 (BT Level 3, PO1, PO2, PO5)",
        "software": "Python 3.14.6 (Matplotlib)",
        "key_algorithms": ["Line plots", "Bar charts", "Loss convergence visualization", "Axis labeling and legends"],
        "critical_checkpoints": ["Matplotlib figure creation", "Labels, titles, and grid formatting", "Interpretation of visual curves"]
    },
    3: {
        "title": "Graph Representation using Python",
        "aim": "To create and analyze graphs",
        "co": "CO1 (BT Level 3, PO1, PO2, PO5)",
        "software": "Python 3.14.6 (NetworkX)",
        "key_algorithms": ["Graph initialization", "Adjacency modeling", "Dijkstra shortest path", "Degree centrality"],
        "critical_checkpoints": ["Node/edge consistency", "Correct weighted edge formulation", "Graph traversal functions"]
    },
    4: {
        "title": "Water Jug Problem using State Space Approach",
        "aim": "To solve AI problem using state space approach",
        "co": "CO1 (BT Level 3, PO1, PO2, PO5)",
        "software": "Python 3.14.6",
        "key_algorithms": ["State Space Formulation (x, y)", "Production Rules (Fill, Empty, Pour)", "BFS / DFS state search", "Visited state tracking"],
        "critical_checkpoints": ["Valid boundary constraints 0 <= x <= CapX", "Proper pour transfer logic", "Handling unreachable states"]
    },
    5: {
        "title": "Uninformed Search Algorithms (BFS and DFS)",
        "aim": "To implement BFS and DFS",
        "co": "CO1 (BT Level 3, PO1, PO2, PO5)",
        "software": "Python 3.14.6",
        "key_algorithms": ["Breadth First Search (FIFO queue)", "Depth First Search (LIFO / recursion)", "Completeness and Optimality", "Time O(V+E) & Space Complexity"],
        "critical_checkpoints": ["collections.deque usage for BFS", "Cycle prevention via visited array", "Correct traversal sequence matching output"]
    },
    6: {
        "title": "Informed Search (A* Algorithm)",
        "aim": "To implement heuristic search",
        "co": "CO2 (BT Level 4, PO1, PO2, PO3, PO4, PO5)",
        "software": "Python 3.14.6",
        "key_algorithms": ["Evaluation function f(n) = g(n) + h(n)", "Admissible and consistent heuristics", "Open List (frontier) & Closed List", "Parent pointer backtracking"],
        "critical_checkpoints": ["h(n) <= h*(n) admissibility", "Correct cost accumulation g(n)", "Node re-expansion handling if cheaper path found"]
    },
    7: {
        "title": "Game Playing using Minimax Algorithm",
        "aim": "To implement Minimax algorithm",
        "co": "CO2 (BT Level 5, PO1, PO2, PO3, PO4, PO5)",
        "software": "Python 3.14.6",
        "key_algorithms": ["Game Trees", "Zero-Sum Assumption", "Maximizer / Minimizer recursive alternating turns", "Terminal utility backpropagation", "Depth bounding"],
        "critical_checkpoints": ["Correct terminal condition evaluation", "Accurate max/min propagation", "Zero-sum game property defense"]
    },
    8: {
        "title": "Snake Game using Python",
        "aim": "To develop a simple game",
        "co": "CO2 (BT Level 4, PO1, PO2, PO3, PO4, PO5)",
        "software": "Python 3.14.6 (Pygame)",
        "key_algorithms": ["Event loop", "Tick-rate throttling", "Coordinate grid displacement", "Boundary & self-collision detection"],
        "critical_checkpoints": ["Pygame display loop", "Frame rate control", "Snake body segment list manipulation"]
    },
    9: {
        "title": "Medical Diagnosis System (Rule-Based Expert System)",
        "aim": "To develop rule-based expert system",
        "co": "CO2 (BT Level 4, PO1, PO2, PO3, PO4, PO5)",
        "software": "Python 3.14.6 (Tkinter / PyKnow / Rules)",
        "key_algorithms": ["Knowledge base representation", "Inference engine", "Forward chaining", "Condition-action production rules"],
        "critical_checkpoints": ["Clear symptom fact inputs", "Deterministic rule chaining", "Valid disease hypothesis deduction"]
    },
    10: {
        "title": "Social Network Analysis Dashboard",
        "aim": "To develop a simple social network analysis system using Python",
        "co": "CO2 (BT Level 4, PO1, PO2, PO3, PO4, PO5)",
        "software": "Python 3.14.6 (NetworkX, Matplotlib)",
        "key_algorithms": ["Degree Centrality", "Betweenness Centrality", "Closeness Centrality", "Network visualization", "Bridge/Influencer detection"],
        "critical_checkpoints": ["Centrality metric computation", "Interpretation of influential nodes", "Visual graph layout"]
    }
}
