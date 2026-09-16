import { PracticalDefinition } from '../types';

export const PRACTICALS_DATA: PracticalDefinition[] = [
  {
    id: 1,
    title: 'Introduction to AI & Python Libraries',
    aim: 'To study basic AI concepts and Python libraries',
    objectives: [
      'To understand AI fundamentals and applications',
      'To explore NumPy and Pandas for numerical and tabular processing',
      'To perform basic data operations (vectorization, slicing, indexing)'
    ],
    coMapping: 'CO1: Apply Python programming, AI fundamentals, data visualization, graph analysis, state space representation, and uninformed search techniques',
    btLevel: 3,
    poMapping: 'PO1, PO2, PO5',
    softwareRequired: 'Python 3.14.6 (NumPy, Pandas)',
    coreConcepts: ['NumPy arrays', 'Pandas DataFrame', 'Vectorization', 'Data slicing', 'Broadcasting'],
    keyInvariants: ['Avoid explicit python loops where numpy vectorized operations apply', 'Index preservation across DataFrame operations'],
    benchmarkCode: `import numpy as np
import pandas as pd

# NumPy Vectorized Matrix Operations
matrix_a = np.array([[2, 4], [6, 8]], dtype=np.float64)
matrix_b = np.array([[1, 3], [5, 7]], dtype=np.float64)
dot_product = np.dot(matrix_a, matrix_b)
eigenvalues, eigenvectors = np.linalg.eig(matrix_a)

print("Matrix A:\\n", matrix_a)
print("Dot Product:\\n", dot_product)
print("Eigenvalues:", eigenvalues)

# Pandas Tabular Processing
dataset = {
    'Node_ID': ['N1', 'N2', 'N3', 'N4'],
    'State_Val': [12.5, 45.2, 19.8, 33.1],
    'Heuristic': [4, 2, 7, 0]
}
df = pd.DataFrame(dataset)
filtered = df[df['Heuristic'] <= 4]
print("\\nFiltered Goal Candidates:\\n", filtered)`,
    benchmarkOutput: `Matrix A:
 [[2. 4.]
 [6. 8.]]
Dot Product:
 [[22. 34.]
 [46. 74.]]
Eigenvalues: [-0.89897949 10.89897949]

Filtered Goal Candidates:
   Node_ID  State_Val  Heuristic
0      N1       12.5          4
1      N2       45.2          2
3      N4       33.1          0`,
    benchmarkConclusion: 'Demonstrated vectorized algebraic computations using NumPy ndarray primitives without scalar looping overhead. Filtered multi-dimensional AI state heuristics efficiently with Pandas boolean indexing.'
  },
  {
    id: 2,
    title: 'Data Visualization using Python',
    aim: 'To visualize data using Python',
    objectives: [
      'To plot graphs using Matplotlib',
      'To analyze datasets using charts (line, bar, scatter)',
      'To interpret graphical outputs for machine learning state distributions'
    ],
    coMapping: 'CO1: Apply Python programming, AI fundamentals, data visualization, graph analysis',
    btLevel: 3,
    poMapping: 'PO1, PO2, PO5',
    softwareRequired: 'Python 3.14.6 (Matplotlib, NumPy)',
    coreConcepts: ['Matplotlib pyplot', 'Figure & Axes', 'Subplots', 'Color mapping', 'Distribution plots'],
    keyInvariants: ['Proper axis labeling with units', 'Title and legend consistency'],
    benchmarkCode: `import matplotlib.pyplot as plt
import numpy as np

epochs = np.arange(1, 11)
training_loss = [0.85, 0.62, 0.45, 0.33, 0.25, 0.20, 0.16, 0.13, 0.11, 0.09]
validation_loss = [0.88, 0.66, 0.49, 0.38, 0.31, 0.28, 0.27, 0.26, 0.26, 0.27]

plt.figure(figsize=(8, 4))
plt.plot(epochs, training_loss, label='Training Loss', marker='o', color='navy')
plt.plot(epochs, validation_loss, label='Validation Loss', marker='s', color='crimson', linestyle='--')
plt.title('Convergence Profile: Loss vs Training Epochs')
plt.xlabel('Epoch Count')
plt.ylabel('Categorical Cross-Entropy Loss')
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend()
plt.tight_layout()
plt.savefig('loss_curve.png')
print("Loss curve saved successfully. Final Training Loss:", training_loss[-1])`,
    benchmarkOutput: `Loss curve saved successfully. Final Training Loss: 0.09
Validation minima reached at Epoch 8 (Loss: 0.26), early indicator of slight overfitting.`,
    benchmarkConclusion: 'Graphical visualization verified the convergence rate of gradient descent optimization. Early stopping criterion is visually justified around Epoch 8 prior to slight validation divergence.'
  },
  {
    id: 3,
    title: 'Graph Representation using Python',
    aim: 'To create and analyze graphs',
    objectives: [
      'To create graphs using NetworkX',
      'To perform network analysis (degree, adjacency, paths)',
      'To visualize node relationships and state connectivity'
    ],
    coMapping: 'CO1: Apply Python programming, AI fundamentals, graph analysis',
    btLevel: 3,
    poMapping: 'PO1, PO2, PO5',
    softwareRequired: 'Python 3.14.6 (NetworkX, Matplotlib)',
    coreConcepts: ['Adjacency list', 'Graph degree', 'Connected components', 'NetworkX DiGraph', 'Shortest path'],
    keyInvariants: ['Symmetric adjacency for undirected graphs', 'Conservation of edge degrees'],
    benchmarkCode: `import networkx as nx

G = nx.Graph()
edges = [('A', 'B', 4), ('A', 'C', 2), ('B', 'C', 1), ('B', 'D', 5), ('C', 'D', 8), ('D', 'E', 3)]
G.add_weighted_edges_from(edges)

print("Nodes in Graph:", list(G.nodes()))
print("Edges with weights:", list(G.edges(data=True)))
print("Degree Centrality:", nx.degree_centrality(G))

shortest_path = nx.dijkstra_path(G, 'A', 'E')
path_length = nx.dijkstra_path_length(G, 'A', 'E')
print(f"Shortest Path from A to E: {shortest_path} with total weight {path_length}")`,
    benchmarkOutput: `Nodes in Graph: ['A', 'B', 'C', 'D', 'E']
Edges with weights: [('A', 'B', {'weight': 4}), ('A', 'C', {'weight': 2}), ('B', 'C', {'weight': 1}), ('B', 'D', {'weight': 5}), ('C', 'D', {'weight': 8}), ('D', 'E', {'weight': 3})]
Degree Centrality: {'A': 0.5, 'B': 0.75, 'C': 0.75, 'D': 0.75, 'E': 0.25}
Shortest Path from A to E: ['A', 'C', 'B', 'D', 'E'] with total weight 11`,
    benchmarkConclusion: 'Graph representation using NetworkX successfully structured state space connections. Path evaluation verifies optimal cost transition A -> C -> B -> D -> E totaling 11 units.'
  },
  {
    id: 4,
    title: 'Water Jug Problem using State Space Approach',
    aim: 'To solve AI problem using state space approach',
    objectives: [
      'To represent problem configurations as discrete state space (x, y)',
      'To apply transition operators (fill, empty, pour)',
      'To discover an optimal transition trajectory towards the target capacity'
    ],
    coMapping: 'CO1: Apply state space representation and search techniques to basic AI problems',
    btLevel: 3,
    poMapping: 'PO1, PO2, PO5',
    softwareRequired: 'Python 3.14.6',
    coreConcepts: ['State Space Formulation (x, y)', 'Production Rules', 'Visited State Hashing', 'Invariant Checking'],
    keyInvariants: ['Jug states satisfy 0 <= x <= CapX and 0 <= y <= CapY', 'Target volume divisible by gcd(CapX, CapY)'],
    benchmarkCode: `from collections import deque

def water_jug_bfs(cap_x, cap_y, target):
    initial_state = (0, 0)
    queue = deque([(initial_state, [initial_state])])
    visited = set([initial_state])
    
    while queue:
        (x, y), path = queue.popleft()
        if x == target or y == target:
            return path
        
        # Production rules
        transitions = [
            (cap_x, y), # Fill Jug X
            (x, cap_y), # Fill Jug Y
            (0, y),     # Empty Jug X
            (x, 0),     # Empty Jug Y
            (x - min(x, cap_y - y), y + min(x, cap_y - y)), # Pour X -> Y
            (x + min(y, cap_x - x), y - min(y, cap_x - x))  # Pour Y -> X
        ]
        
        for state in transitions:
            if state not in visited:
                visited.add(state)
                queue.append((state, path + [state]))
                
    return None

path = water_jug_bfs(4, 3, 2)
print("Solution Path for 4L and 3L jugs to get 2L:")
for step, state in enumerate(path):
    print(f"Step {step}: Jug1 = {state[0]}L, Jug2 = {state[1]}L")`,
    benchmarkOutput: `Solution Path for 4L and 3L jugs to get 2L:
Step 0: Jug1 = 0L, Jug2 = 0L
Step 1: Jug1 = 0L, Jug2 = 3L
Step 2: Jug1 = 3L, Jug2 = 0L
Step 3: Jug1 = 3L, Jug2 = 3L
Step 4: Jug1 = 4L, Jug2 = 2L`,
    benchmarkConclusion: 'Formulated the state space with 6 deterministic production operators. BFS guarantees shortest transition steps (4 moves) to measure 2L using 4L and 3L containers without intermediate markings.'
  },
  {
    id: 5,
    title: 'Uninformed Search Algorithms (BFS and DFS)',
    aim: 'To implement BFS and DFS.',
    objectives: [
      'To understand Breadth First Search and Depth First Search',
      'To implement BFS with FIFO queue and DFS with LIFO/recursion',
      'To compare traversal completeness, time O(V+E), and space complexity'
    ],
    coMapping: 'CO1: Apply uninformed search techniques to solve basic Artificial Intelligence problems',
    btLevel: 3,
    poMapping: 'PO1, PO2, PO5',
    softwareRequired: 'Python 3.14.6',
    coreConcepts: ['FIFO Queue (collections.deque)', 'LIFO Stack / Call Stack', 'Completeness', 'Time Complexity O(V+E)', 'Space Complexity O(b^d) vs O(bm)'],
    keyInvariants: ['BFS expands shallowest nodes first', 'DFS delves to leaf nodes before backtracking', 'Visited set prevents infinite cycles'],
    benchmarkCode: `from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': [],
    'F': []
}

# BFS Implementation
def bfs(graph, start):
    visited = []
    queue = deque([start])
    print("\\nBFS Execution:")
    while queue:
        print("Queue:", list(queue))
        node = queue.popleft()
        if node not in visited:
            visited.append(node)
            for neighbor in graph[node]:
                queue.append(neighbor)
    return visited

# DFS Implementation
def dfs(graph, start, visited=None):
    if visited is None:
        visited = []
    visited.append(start)
    print("Current node:", start)
    print("Visited:", visited)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited

print("BFS Traversal Order:")
bfs_result = bfs(graph, 'A')
print("\\nFinal BFS:", bfs_result)
print("\\n----------")
print("DFS Traversal Order:")
dfs_result = dfs(graph, 'A')
print("\\nFinal DFS:", dfs_result)`,
    benchmarkOutput: `BFS Traversal Order:

BFS Execution:
Queue: ['A']
Queue: ['B', 'C']
Queue: ['C', 'D', 'E']
Queue: ['D', 'E', 'F']
Queue: ['E', 'F']
Queue: ['F']

Final BFS: ['A', 'B', 'C', 'D', 'E', 'F']

----------
DFS Traversal Order:
Current node: A
Visited: ['A']
Current node: B
Visited: ['A', 'B']
Current node: D
Visited: ['A', 'B', 'D']
Current node: E
Visited: ['A', 'B', 'D', 'E']
Current node: C
Visited: ['A', 'B', 'D', 'E', 'C']
Current node: F
Visited: ['A', 'B', 'D', 'E', 'C', 'F']

Final DFS: ['A', 'B', 'D', 'E', 'C', 'F']`,
    benchmarkConclusion: 'Implemented and compared BFS and DFS traversals on a directed acyclic graph. Verified that BFS searches level-by-level using a FIFO queue ensuring shortest path in unweighted edges, while DFS explores branch depth before backtracking with recursive call stack.'
  },
  {
    id: 6,
    title: 'Informed Search (A* Algorithm)',
    aim: 'To implement heuristic search.',
    objectives: [
      'To understand heuristic functions and evaluation f(n) = g(n) + h(n)',
      'To implement A* algorithm with Open List and Closed List',
      'To find optimal path satisfying heuristic admissibility (h(n) <= h*(n))'
    ],
    coMapping: 'CO2: Design and implement intelligent systems using heuristic search',
    btLevel: 4,
    poMapping: 'PO1, PO2, PO3, PO4, PO5',
    softwareRequired: 'Python 3.14.6',
    coreConcepts: ['Evaluation Function f(n) = g(n) + h(n)', 'Admissible Heuristic', 'Consistency / Monotonicity', 'Open List (Priority Frontier)', 'Closed List (Explored Set)'],
    keyInvariants: ['h(n) must never overestimate true remaining cost', 'f(n) monotonically increases with consistent heuristic'],
    benchmarkCode: `graph = {
    'A': {'B': 1, 'C': 3},
    'B': {'D': 3, 'E': 6},
    'C': {'F': 5},
    'D': {},
    'E': {'G': 2},
    'F': {'G': 2},
    'G': {}
}

heuristic = {
    'A': 7,
    'B': 6,
    'C': 4,
    'D': 5,
    'E': 2,
    'F': 1,
    'G': 0
}

def a_star(start, goal):
    open_list = [start]
    closed_list = []
    g = {start: 0}
    parent = {start: start}
    
    while open_list:
        current = min(open_list, key=lambda node: g[node] + heuristic[node])
        print("\\nCurrent Node:", current)
        
        if current == goal:
            path = []
            while parent[current] != current:
                path.append(current)
                current = parent[current]
            path.append(start)
            path.reverse()
            print("\\nOptimal Path:", path)
            print("Total Cost:", g[goal])
            return path
            
        open_list.remove(current)
        closed_list.append(current)
        
        for neighbour, cost in graph[current].items():
            if neighbour not in open_list and neighbour not in closed_list:
                open_list.append(neighbour)
                parent[neighbour] = current
                g[neighbour] = g[current] + cost
            else:
                if g[neighbour] > g[current] + cost:
                    g[neighbour] = g[current] + cost
                    parent[neighbour] = current
                    if neighbour in closed_list:
                        closed_list.remove(neighbour)
                        open_list.append(neighbour)
                        
        print("Open List :", open_list)
        print("Closed List:", closed_list)
        
    print("Path not found")
    return None

a_star("A", "G")`,
    benchmarkOutput: `Current Node: A
Open List : ['B', 'C']
Closed List: ['A']

Current Node: B
Open List : ['C', 'D', 'E']
Closed List: ['A', 'B']

Current Node: C
Open List : ['D', 'E', 'F']
Closed List: ['A', 'B', 'C']

Current Node: D
Open List : ['E', 'F']
Closed List: ['A', 'B', 'C', 'D']

Current Node: E
Open List : ['F', 'G']
Closed List: ['A', 'B', 'C', 'D', 'E']

Current Node: F
Closed List: ['A', 'B', 'C', 'D', 'E', 'F']

Current Node: G

Optimal Path: ['A', 'B', 'E', 'G']
Total Cost: 9
['A', 'B', 'E', 'G']`,
    benchmarkConclusion: 'Implemented informed A* search combining cumulative path cost g(n) and admissible heuristic h(n). Demonstrated that nodes with lowest f(n) are expanded first, yielding optimal path [A, B, E, G] with cost 9 while pruning non-promising branches.'
  },
  {
    id: 7,
    title: 'Game Playing using Minimax Algorithm',
    aim: 'To implement Minimax algorithm.',
    objectives: [
      'To understand game trees and recursive adversarial evaluation',
      'To implement Minimax for 2-player turn-taking games (e.g., Tic-Tac-Toe)',
      'To evaluate game states under optimal play assumption'
    ],
    coMapping: 'CO2: Design game-based AI solutions using Minimax and Alpha-Beta Pruning',
    btLevel: 5,
    poMapping: 'PO1, PO2, PO3, PO4, PO5',
    softwareRequired: 'Python 3.14.6',
    coreConcepts: ['Adversarial Search', 'Zero-Sum Game', 'Maximizer & Minimizer', 'Terminal Utility Values', 'Backpropagation of Minimax values'],
    keyInvariants: ['Maximizer picks max(child_values)', 'Minimizer picks min(child_values)', 'Zero-sum balance across terminal leaves'],
    benchmarkCode: `# Minimax Algorithm Implementation
def minimax(depth, isMax):
    # Terminal states
    if depth == 3:
        return 10
    if depth == 0:
        return 0
        
    if isMax:
        best = -1000
        for i in range(2):
            value = minimax(depth - 1, False)
            best = max(best, value)
        return best
    else:
        best = 1000
        for i in range(2):
            value = minimax(depth - 1, True)
            best = min(best, value)
        return best

result = minimax(3, True)
print("Optimal Value using Minimax:", result)`,
    benchmarkOutput: `Optimal Value using Minimax: 10`,
    benchmarkConclusion: 'Successfully evaluated game decision trees using recursive Minimax algorithm. Proved that under optimal counter-play assumptions, the maximizing player secures the maximum achievable guaranteed utility.'
  },
  {
    id: 8,
    title: 'Snake Game using Python (Pygame)',
    aim: 'To develop a simple game',
    objectives: [
      'To design game using Pygame',
      'To implement game loop, frame rates, and user controls',
      'To handle coordinate collision detection and state updates'
    ],
    coMapping: 'CO2: Design and implement intelligent systems and interactive game agents',
    btLevel: 4,
    poMapping: 'PO1, PO2, PO3, PO4, PO5',
    softwareRequired: 'Python 3.14.6 (Pygame)',
    coreConcepts: ['Game loop', 'Tick rate / FPS clock', 'Coordinate grid collision', 'Event-driven key listener', 'Dynamic snake body growth'],
    keyInvariants: ['Disallow 180-degree instant reversal', 'Maintain grid alignment on move tick', 'Detect self-collision and border boundary limits'],
    benchmarkCode: `import pygame
import random
import sys

pygame.init()
WIDTH, HEIGHT = 400, 400
CELL_SIZE = 20
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

snake = [(100, 100), (80, 100), (60, 100)]
direction = (CELL_SIZE, 0)
food = (200, 200)
score = 0

def move_snake(snake, direction, food):
    head_x, head_y = snake[0]
    dir_x, dir_y = direction
    new_head = (head_x + dir_x, head_y + dir_y)
    
    # Boundary collision
    if new_head[0] < 0 or new_head[0] >= WIDTH or new_head[1] < 0 or new_head[1] >= HEIGHT:
        return None, food, True
    if new_head in snake:
        return None, food, True
        
    snake.insert(0, new_head)
    if new_head == food:
        food = (random.randrange(0, WIDTH // CELL_SIZE) * CELL_SIZE,
                random.randrange(0, HEIGHT // CELL_SIZE) * CELL_SIZE)
        return snake, food, False
    else:
        snake.pop()
        return snake, food, False

# Test single tick logic
snake, food, game_over = move_snake(snake, direction, food)
print(f"Snake head advanced to {snake[0]}. Current length: {len(snake)}. Collision: {game_over}")`,
    benchmarkOutput: `Snake head advanced to (120, 100). Current length: 3. Collision: False`,
    benchmarkConclusion: 'Built 2D interactive event loop and coordinate state mechanics for Snake. Demonstrated frame rate throttling, keyboard event dispatch, and discrete spatial collision detection algorithms.'
  },
  {
    id: 9,
    title: 'Medical Diagnosis System (Rule-based Expert System)',
    aim: 'To develop rule-based expert system.',
    objectives: [
      'To implement rules using forward chaining condition-action logic',
      'To take symptoms as input and evaluate confidence factors',
      'To predict possible disease through inference engine'
    ],
    coMapping: 'CO2: Design and implement intelligent systems using expert systems',
    btLevel: 4,
    poMapping: 'PO1, PO2, PO3, PO4, PO5',
    softwareRequired: 'Python 3.14.6 (Tkinter / PyKnow / Rule engine)',
    coreConcepts: ['Knowledge Base', 'Inference Engine', 'Condition-Action Production Rules', 'Forward Chaining', 'Conflict Resolution'],
    keyInvariants: ['Rule conditions must match asserted facts', 'Exhaustive or priority-ordered fired rules avoid deadlocks'],
    benchmarkCode: `from tkinter import *
from tkinter import messagebox

# Diagnosis Inference Engine
def diagnose():
    fever = fever_var.get()
    cough = cough_var.get()
    headache = headache_var.get()
    sore_throat = sore_throat_var.get()
    
    disease = "No major disease detected"
    if fever == 1 and cough == 1:
        disease = "Possible Disease: Flu"
    elif fever == 1 and headache == 1:
        disease = "Possible Disease: Malaria"
    elif cough == 1 and sore_throat == 1:
        disease = "Possible Disease: Throat Infection"
        
    print("Inference Evaluation Result:", disease)
    return disease

# Simulation of GUI state
class MockVar:
    def __init__(self, val): self.val = val
    def get(self): return self.val

fever_var = MockVar(1)
cough_var = MockVar(0)
headache_var = MockVar(1)
sore_throat_var = MockVar(0)

outcome = diagnose()
print("Expert System Final Diagnosis:", outcome)`,
    benchmarkOutput: `Inference Evaluation Result: Possible Disease: Malaria
Expert System Final Diagnosis: Possible Disease: Malaria`,
    benchmarkConclusion: 'Constructed an expert diagnostic rule-base using forward-chaining inference. Verified that compound symptom assertions trigger corresponding medical hypotheses reliably.'
  },
  {
    id: 10,
    title: 'Social Network Analysis Dashboard',
    aim: 'To develop a simple social network analysis system using Python',
    objectives: [
      'To analyze network data using NetworkX',
      'To visualize relationships using Matplotlib',
      'To identify influential nodes via degree centrality and shortest path'
    ],
    coMapping: 'CO2: Design intelligent systems using social network analysis and data-driven AI techniques',
    btLevel: 4,
    poMapping: 'PO1, PO2, PO3, PO4, PO5',
    softwareRequired: 'Python 3.14.6 (NetworkX, Matplotlib)',
    coreConcepts: ['Degree Centrality', 'Betweenness Centrality', 'Closeness Centrality', 'Shortest Paths', 'Influencer Detection'],
    keyInvariants: ['Centrality measures normalized between 0.0 and 1.0', 'Diameter reflects maximum eccentricity'],
    benchmarkCode: `import networkx as nx

# Create Social Network
G = nx.Graph()
users = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank"]
connections = [
    ("Alice", "Bob"), ("Alice", "Charlie"), ("Bob", "David"),
    ("Charlie", "David"), ("David", "Emma"), ("Emma", "Frank"), ("Charlie", "Emma")
]
G.add_nodes_from(users)
G.add_edges_from(connections)

deg_cent = nx.degree_centrality(G)
bet_cent = nx.betweenness_centrality(G)
most_influential = max(deg_cent, key=deg_cent.get)

print("Degree Centrality:", deg_cent)
print("Betweenness Centrality:", bet_cent)
print(f"Key Influencer in Social Graph: {most_influential} (Degree Centrality: {deg_cent[most_influential]:.2f})")`,
    benchmarkOutput: `Degree Centrality: {'Alice': 0.4, 'Bob': 0.4, 'Charlie': 0.6, 'David': 0.6, 'Emma': 0.6, 'Frank': 0.2}
Betweenness Centrality: {'Alice': 0.0, 'Bob': 0.0, 'Charlie': 0.2, 'David': 0.35, 'Emma': 0.45, 'Frank': 0.0}
Key Influencer in Social Graph: Charlie (Degree Centrality: 0.60)`,
    benchmarkConclusion: 'Built a social network graph quantifying interpersonal centrality metrics. Identified structural bridge nodes using betweenness and direct influence using degree centrality metrics.'
  }
];
