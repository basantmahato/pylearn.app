import json
import random
import os

mcq_pool = [
    {
        "question": "Which of the following is NOT a core data type in Python?",
        "options": ["List", "Dictionary", "Class", "Tuple"],
        "answer": 2
    },
    {
        "question": "What is the result of 5 // 2?",
        "options": ["2.5", "2", "3", "Error"],
        "answer": 1
    },
    {
        "question": "Which of these is used to define a block of code in Python?",
        "options": ["Indentation", "Curly braces", "Parentheses", "Square brackets"],
        "answer": 0
    },
    {
        "question": "Which operator is used for string concatenation?",
        "options": ["+", "*", "-", "&"],
        "answer": 0
    },
    {
        "question": "What is the output of bool('False')?",
        "options": ["True", "False", "Error", "None"],
        "answer": 0
    },
    {
        "question": "Which of the following functions is used to find the length of a string?",
        "options": ["length()", "len()", "size()", "count()"],
        "answer": 1
    },
    {
        "question": "What is the output of 'Python'[1:3]?",
        "options": ["Pyt", "yt", "yth", "th"],
        "answer": 1
    },
    {
        "question": "Which method is used to add an element at the end of a list?",
        "options": ["add()", "append()", "insert()", "extend()"],
        "answer": 1
    },
    {
        "question": "Tuples are ____ in nature.",
        "options": ["mutable", "immutable", "dynamic", "expandable"],
        "answer": 1
    },
    {
        "question": "Which of the following is a valid dictionary declaration?",
        "options": ["d = {1: 'A', 2: 'B'}", "d = [1: 'A', 2: 'B']", "d = (1: 'A', 2: 'B')", "d = <1: 'A', 2: 'B'>"],
        "answer": 0
    },
    {
        "question": "What does a CPU do?",
        "options": ["Storage", "Processing", "Networking", "Printing"],
        "answer": 1
    },
    {
        "question": "What is cyber safety?",
        "options": ["Protecting hardware", "Safe Internet usage", "Encrypting files", "Antivirus software"],
        "answer": 1
    },
    {
        "question": "Which of the following is an input device?",
        "options": ["Monitor", "Printer", "Keyboard", "Speaker"],
        "answer": 2
    },
    {
        "question": "In Python, what is the data type of the result of 'input()' function?",
        "options": ["int", "float", "string", "boolean"],
        "answer": 2
    },
    {
        "question": "Which loop is used when the number of iterations is known?",
        "options": ["while", "for", "do-while", "until"],
        "answer": 1
    }
]

short_pool = [
    {
        "question": "Differentiate between compiler and interpreter.",
        "marks": 3,
        "keywords": ["entire program", "line by line", "fast", "slow", "translation"]
    },
    {
        "question": "What is cyberbullying? How can it be prevented?",
        "marks": 3,
        "keywords": ["harassment", "online", "reporting", "blocking", "safety"]
    },
    {
        "question": "Explain the difference between '/' and '//' operators in Python.",
        "marks": 3,
        "keywords": ["float division", "floor division", "integer", "decimal"]
    },
    {
        "question": "What are keywords in Python? Give 2 examples.",
        "marks": 3,
        "keywords": ["reserved words", "special meaning", "if", "else", "for", "while"]
    },
    {
        "question": "What is the difference between a list and a tuple?",
        "marks": 3,
        "keywords": ["mutable", "immutable", "brackets", "parentheses", "modification"]
    },
    {
        "question": "Explain the concept of key-value pairs in a dictionary.",
        "marks": 3,
        "keywords": ["unique", "mapping", "index", "curly braces", "hash"]
    },
    {
        "question": "What is the role of an Operating System?",
        "marks": 3,
        "keywords": ["interface", "resource management", "hardware", "software", "bridge"]
    },
    {
        "question": "Define string slicing with an example.",
        "marks": 3,
        "keywords": ["substring", "start", "stop", "step", "colon", "sequence"]
    }
]

code_pool = [
    {
        "question": "Write a program to check if a number is prime.",
        "marks": 5,
        "hints": ["Use a loop", "Check divisibility", "Range from 2 to n-1"]
    },
    {
        "question": "Write a Python script to print the Fibonacci series up to n terms.",
        "marks": 5,
        "hints": ["Initialize a=0, b=1", "Use a loop", "Update a and b"]
    },
    {
        "question": "Write a program to count vowels in a given string.",
        "marks": 5,
        "hints": ["Define a string of vowels", "Iterate through characters", "Keep a count"]
    },
    {
        "question": "Write a script that takes a list of numbers and returns a new list with only even numbers.",
        "marks": 5,
        "hints": ["Use a list comprehension or for loop", "Condition x % 2 == 0", "Append to result list"]
    },
    {
        "question": "Write a program to find the largest number in a list without using the max() function.",
        "marks": 5,
        "hints": ["Assume first element is largest", "Iterate and compare", "Update largest"]
    },
    {
        "question": "Create a dictionary of 3 students with their marks and write code to find the highest marks.",
        "marks": 5,
        "hints": ["Use max() with dict.values()", "Iterate over dictionary", "Track max marks"]
    }
]

error_pool = [
    {
        "question": "Find the error:\nx = 10\nif x = 10:\n    print('Yes')",
        "marks": 3,
        "answer": "SyntaxError: invalid syntax",
        "explanation": "Assignment operator '=' is used instead of comparison operator '=='."
    },
    {
        "question": "Predict the output:\nlst = [1, 2, 3]\nlst.append([4, 5])\nprint(len(lst))",
        "marks": 2,
        "answer": "4",
        "explanation": "The list [4, 5] is appended as a single element, so the list becomes [1, 2, 3, [4, 5]]."
    },
    {
        "question": "Find the error:\nfor i in range(5)\n    print(i)",
        "marks": 3,
        "answer": "SyntaxError: expected ':'",
        "explanation": "Missing colon ':' at the end of the for loop statement."
    },
    {
        "question": "Predict the output:\ns = 'Python'\nprint(s[::-1])",
        "marks": 2,
        "answer": "nohtyP",
        "explanation": "The slice [::-1] reverses the string."
    },
    {
        "question": "Find the error:\nd = {1: 'a', 2: 'b'}\nprint(d[3])",
        "marks": 3,
        "answer": "KeyError: 3",
        "explanation": "The key 3 does not exist in the dictionary."
    },
    {
        "question": "Predict the output:\nprint(2 ** 3 ** 2)",
        "marks": 2,
        "answer": "512",
        "explanation": "Exponentiation is evaluated right-to-left. 3**2 is 9, and 2**9 is 512."
    }
]

def generate_paper(paper_num):
    # Select random questions for each section
    mcq = random.sample(mcq_pool, 10)
    short = random.sample(short_pool, 8) # Wait, need 10 short questions for 30 marks (3 marks each). We have 8 in pool. Let's sample 8 and duplicate or expand pool.
    code = random.sample(code_pool, 6)
    error = random.sample(error_pool, 6) # Need a few to add up to 20 marks. Let's dynamically add them.
    
    # Just to be safe, let's reuse questions if needed.
    
    mcq_questions = []
    for i, q in enumerate(random.choices(mcq_pool, k=10)):
        q_copy = dict(q)
        q_copy["id"] = f"A{i+1}"
        mcq_questions.append(q_copy)
        
    short_questions = []
    for i, q in enumerate(random.choices(short_pool, k=10)):
        q_copy = dict(q)
        q_copy["id"] = f"B{i+1}"
        # Adjust marks to 3
        q_copy["marks"] = 3
        short_questions.append(q_copy)
        
    code_questions = []
    for i, q in enumerate(random.choices(code_pool, k=6)):
        q_copy = dict(q)
        q_copy["id"] = f"C{i+1}"
        q_copy["marks"] = 5
        code_questions.append(q_copy)
        
    error_questions = []
    # To get exactly 20 marks: 4 Qs of 3 marks, 4 Qs of 2 marks. Total 8 Qs.
    for i in range(8):
        q = random.choice(error_pool)
        q_copy = dict(q)
        q_copy["id"] = f"D{i+1}"
        q_copy["marks"] = 3 if i < 4 else 2
        error_questions.append(q_copy)

    paper = {
        "paperId": f"11th-sample-{paper_num}",
        "title": f"Class 11 Python Sample Paper {paper_num}",
        "subtitle": "Class 11 Computer Science Assessment",
        "duration": "90 minutes",
        "totalMarks": 100,
        "difficulty": random.choice(["Easy", "Medium", "Hard"]),
        "sections": [
            {
                "sectionId": "A",
                "title": "Multiple Choice Questions",
                "marks": 20,
                "questions": mcq_questions
            },
            {
                "sectionId": "B",
                "title": "Short Answer Questions",
                "marks": 30,
                "questions": short_questions
            },
            {
                "sectionId": "C",
                "title": "Code Writing",
                "marks": 30,
                "questions": code_questions
            },
            {
                "sectionId": "D",
                "title": "Error Finding & Output Prediction",
                "marks": 20,
                "questions": error_questions
            }
        ]
    }
    return paper

output_dir = r"C:\Users\basant\Documents\Basant\APPS\PYLEARN\data\11th\samples"
os.makedirs(output_dir, exist_ok=True)

for i in range(1, 21):
    paper = generate_paper(i)
    file_path = os.path.join(output_dir, f"sample{i}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(paper, f, indent=2)

print("20 sample papers generated successfully.")
