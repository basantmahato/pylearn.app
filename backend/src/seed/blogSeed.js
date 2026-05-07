require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const sampleBlogs = [
    {
        title: "10 Python Study Tips for CBSE Class 12 Students",
        slug: "python-study-tips-cbse-class-12",
        content: `<h2>Master Python with These Proven Strategies</h2>
<p>Preparing for your CBSE Class 12 Computer Science exam? Python is a crucial part of your curriculum, and mastering it can significantly boost your scores. Here are 10 proven tips to help you excel:</p>

<h3>1. Understand the Basics First</h3>
<p>Before diving into complex programs, ensure you have a solid grasp of Python fundamentals - variables, data types, operators, and control structures. These building blocks are essential for writing efficient code.</p>

<h3>2. Practice Daily</h3>
<p>Consistency is key in programming. Dedicate at least 30 minutes daily to coding practice. Use PyLearn's daily challenges to keep your skills sharp.</p>

<h3>3. Work on Real Projects</h3>
<p>Theory alone won't make you a programmer. Build small projects like calculators, to-do lists, or simple games to apply your knowledge practically.</p>

<h3>4. Master Lists and Dictionaries</h3>
<p>These data structures are heavily tested in CBSE exams. Practice various operations like slicing, appending, and dictionary comprehensions.</p>

<h3>5. Understand File Handling</h3>
<p>File operations are a common exam topic. Practice reading from and writing to files using various modes (r, w, a, rb, wb).</p>

<h3>6. Learn Error Handling</h3>
<p>Master try-except blocks to write robust programs that handle exceptions gracefully. This is often tested in practical exams.</p>

<h3>7. Focus on Object-Oriented Programming</h3>
<p>OOP concepts - classes, objects, inheritance, and polymorphism - carry significant weight in your exam. Create multiple inheritance examples for practice.</p>

<h3>8. Use PyLearn's Quizzes</h3>
<p>Test your knowledge regularly with topic-wise quizzes. This helps identify weak areas that need more attention.</p>

<h3>9. Review Previous Year Questions</h3>
<p>Solving past CBSE board papers gives you insight into the exam pattern and frequently asked questions.</p>

<h3>10. Join Study Groups</h3>
<p>Discussing Python concepts with peers can clarify doubts and expose you to different problem-solving approaches.</p>

<p><strong>Ready to start?</strong> Download PyLearn12 app and begin your Python journey today!</p>`,
        excerpt: "Discover 10 proven strategies to master Python for your CBSE Class 12 Computer Science exam. From daily practice tips to mastering OOP concepts.",
        featuredImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
        author: "PyLearn Education Team",
        tags: ["Python", "CBSE", "Study Tips", "Class 12", "Exam Prep"],
        category: "Exam Preparation",
        metaTitle: "10 Python Study Tips for CBSE Class 12 Students | PyLearn",
        metaDescription: "Master Python for CBSE Class 12 with these 10 proven study tips. Learn daily practice strategies, OOP concepts, and exam preparation techniques.",
        metaKeywords: ["Python CBSE", "Class 12 Computer Science", "Python study tips", "CBSE exam prep", "Python programming"],
        publishedAt: new Date("2024-01-15"),
        status: "published",
        isFeatured: true
    },
    {
        title: "Common Python Mistakes Beginners Make (And How to Avoid Them)",
        slug: "common-python-mistakes-beginners",
        content: `<h2>Avoid These Pitfalls in Your Python Journey</h2>
<p>Learning Python is exciting, but beginners often stumble on common issues. Let's explore the most frequent mistakes and how to steer clear of them:</p>

<h3>1. Indentation Errors</h3>
<p>Python relies heavily on indentation. Mixing tabs and spaces or inconsistent indentation levels will throw IndentationError. Always use 4 spaces per indentation level.</p>

<h3>2. Mutable Default Arguments</h3>
<p>A classic gotcha! Never use mutable objects like lists or dictionaries as default function arguments. They persist across function calls.</p>
<pre><code># Wrong
def add_item(item, items=[]):
    items.append(item)
    return items

# Right
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items</code></pre>

<h3>3. Using '==' Instead of 'is'</h3>
<p>Use '==' for value comparison and 'is' for identity comparison. 'is' checks if two objects are the same object in memory.</p>

<h3>4. Not Using List Comprehensions</h3>
<p>Beginners often write verbose loops when simple list comprehensions would suffice. Learn to write cleaner, more Pythonic code.</p>

<h3>5. Ignoring PEP 8</h3>
<p>Following Python's style guide makes your code readable and professional. Use tools like flake8 or black to auto-format your code.</p>

<h3>6. Poor Variable Naming</h3>
<p>Use descriptive variable names. Instead of 'x', use 'student_name' or 'total_marks'. Your future self will thank you!</p>

<h3>7. Not Handling Exceptions</h3>
<p>Always anticipate and handle potential errors. Use try-except blocks to prevent your programs from crashing unexpectedly.</p>

<p>Awareness is the first step to mastery. Keep coding and learning!</p>`,
        excerpt: "Learn about the most common mistakes Python beginners make and how to avoid them. From indentation errors to mutable default arguments.",
        featuredImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
        author: "Rahul Sharma",
        tags: ["Python", "Beginners", "Programming Tips", "Common Mistakes"],
        category: "Python Tips",
        metaTitle: "Common Python Mistakes Beginners Make | PyLearn Blog",
        metaDescription: "Avoid common Python pitfalls with our comprehensive guide. Learn about indentation errors, mutable defaults, and best coding practices for beginners.",
        metaKeywords: ["Python mistakes", "Python beginners", "programming tips", "Python errors", "learn Python"],
        publishedAt: new Date("2024-01-20"),
        status: "published",
        isFeatured: true
    },
    {
        title: "Understanding Python Functions: A Complete Guide",
        slug: "python-functions-complete-guide",
        content: `<h2>Master Python Functions from Basics to Advanced</h2>
<p>Functions are the building blocks of Python programming. This comprehensive guide covers everything you need to know about Python functions for your CBSE Class 12 exam.</p>

<h3>Function Basics</h3>
<p>A function is a reusable block of code that performs a specific task. Here's the syntax:</p>
<pre><code>def function_name(parameters):
    """Docstring explaining the function"""
    # function body
    return value</code></pre>

<h3>Types of Arguments</h3>
<ul>
<li><strong>Positional Arguments:</strong> Passed in order they are defined</li>
<li><strong>Keyword Arguments:</strong> Passed with parameter names</li>
<li><strong>Default Arguments:</strong> Have predefined values</li>
<li><strong>Variable Length Arguments (*args):</strong> Accept any number of positional arguments</li>
<li><strong>Keyword Variable Length Arguments (**kwargs):</strong> Accept any number of keyword arguments</li>
</ul>

<h3>Lambda Functions</h3>
<p>Anonymous functions defined with lambda keyword:</p>
<pre><code>square = lambda x: x ** 2
print(square(5))  # Output: 25</code></pre>

<h3>Recursive Functions</h3>
<p>Functions that call themselves. Essential for solving problems like factorial, Fibonacci series:</p>
<pre><code>def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)</code></pre>

<h3>Scope and Lifetime</h3>
<p>Understand local vs global variables. Use 'global' keyword to modify global variables inside functions.</p>

<p>Practice these concepts with PyLearn's interactive quizzes and ace your exam!</p>`,
        excerpt: "Complete guide to Python functions covering arguments, lambda, recursion, scope, and more. Perfect for CBSE Class 12 preparation.",
        featuredImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
        author: "PyLearn Education Team",
        tags: ["Python", "Functions", "CBSE", "Programming", "Tutorial"],
        category: "Python Concepts",
        metaTitle: "Python Functions: Complete Guide for CBSE Class 12 | PyLearn",
        metaDescription: "Master Python functions with our comprehensive guide. Learn about arguments, lambda functions, recursion, and scope for CBSE Class 12 exam.",
        metaKeywords: ["Python functions", "lambda functions", "recursive functions", "CBSE Python", "Python tutorial"],
        publishedAt: new Date("2024-01-25"),
        status: "published",
        isFeatured: false
    },
    {
        title: "File Handling in Python: Everything You Need to Know",
        slug: "python-file-handling-guide",
        content: `<h2>Master File Operations for Your CBSE Exam</h2>
<p>File handling is a crucial topic in CBSE Class 12 Computer Science. Let's dive deep into Python's file operations with practical examples.</p>

<h3>Opening Files</h3>
<p>The open() function is used to open files in various modes:</p>
<ul>
<li><strong>'r':</strong> Read mode (default)</li>
<li><strong>'w':</strong> Write mode (creates new file or truncates existing)</li>
<li><strong>'a':</strong> Append mode (adds to end of file)</li>
<li><strong>'x':</strong> Exclusive creation (fails if file exists)</li>
<li><strong>'b':</strong> Binary mode (rb, wb)</li>
<li><strong>'t':</strong> Text mode (default)</li>
</ul>

<h3>Reading Files</h3>
<pre><code># Read entire file
with open('data.txt', 'r') as file:
    content = file.read()

# Read line by line
with open('data.txt', 'r') as file:
    for line in file:
        print(line.strip())

# Read all lines into list
with open('data.txt', 'r') as file:
    lines = file.readlines()</code></pre>

<h3>Writing Files</h3>
<pre><code># Write to file
with open('output.txt', 'w') as file:
    file.write('Hello, World!')

# Write multiple lines
lines = ['Line 1\\n', 'Line 2\\n', 'Line 3\\n']
with open('output.txt', 'w') as file:
    file.writelines(lines)</code></pre>

<h3>Binary File Operations</h3>
<p>Essential for working with images, videos, and other non-text files:</p>
<pre><code># Copy binary file
with open('source.jpg', 'rb') as src:
    with open('dest.jpg', 'wb') as dst:
        dst.write(src.read())</code></pre>

<h3>CSV File Handling</h3>
<p>Using the csv module for structured data:</p>
<pre><code>import csv

# Reading CSV
with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Writing CSV
with open('output.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Name', 'Age', 'City'])
    writer.writerow(['Alice', '25', 'New York'])</code></pre>

<p>Always use 'with' statement for proper resource management!</p>`,
        excerpt: "Comprehensive guide to Python file handling including text files, binary files, and CSV operations. Essential for CBSE Class 12 students.",
        featuredImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
        author: "Priya Patel",
        tags: ["Python", "File Handling", "CSV", "CBSE", "Programming"],
        category: "Python Concepts",
        metaTitle: "Python File Handling: Complete CBSE Guide | PyLearn",
        metaDescription: "Master Python file operations for CBSE Class 12. Learn text files, binary files, CSV handling with practical examples and code snippets.",
        metaKeywords: ["Python file handling", "CBSE file operations", "Python CSV", "binary files Python", "file I/O"],
        publishedAt: new Date("2024-02-01"),
        status: "published",
        isFeatured: true
    },
    {
        title: "Object-Oriented Programming in Python: Classes & Objects",
        slug: "python-oop-classes-objects-guide",
        content: `<h2>OOP Concepts Every CBSE Student Must Know</h2>
<p>Object-Oriented Programming forms a significant portion of your CBSE Class 12 Computer Science syllabus. Let's break down classes and objects in Python.</p>

<h3>What is OOP?</h3>
<p>OOP is a programming paradigm based on objects that contain data (attributes) and code (methods). It promotes code reusability and organization.</p>

<h3>Creating Classes</h3>
<pre><code>class Student:
    # Class attribute
    school = "Delhi Public School"
    
    # Constructor
    def __init__(self, name, roll_no, marks):
        self.name = name
        self.roll_no = roll_no
        self.marks = marks
    
    # Instance method
    def display_info(self):
        print(f"Name: {self.name}")
        print(f"Roll No: {self.roll_no}")
        print(f"Marks: {self.marks}")
    
    def get_grade(self):
        if self.marks >= 90:
            return 'A+'
        elif self.marks >= 80:
            return 'A'
        elif self.marks >= 70:
            return 'B'
        else:
            return 'C'

# Creating objects
student1 = Student("Rahul", 101, 85)
student1.display_info()
print(f"Grade: {student1.get_grade()}")</code></pre>

<h3>Key OOP Concepts</h3>
<ul>
<li><strong>Encapsulation:</strong> Bundling data and methods that work on that data</li>
<li><strong>Abstraction:</strong> Hiding complex implementation details</li>
<li><strong>Inheritance:</strong> Creating new classes from existing ones</li>
<li><strong>Polymorphism:</strong> Ability to take multiple forms</li>
</ul>

<h3>Inheritance Example</h3>
<pre><code>class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Teacher(Person):
    def __init__(self, name, age, subject):
        super().__init__(name, age)
        self.subject = subject
    
    def teach(self):
        print(f"{self.name} teaches {self.subject}")</code></pre>

<h3>Types of Inheritance</h3>
<ul>
<li>Single Inheritance</li>
<li>Multiple Inheritance</li>
<li>Multilevel Inheritance</li>
<li>Hierarchical Inheritance</li>
<li>Hybrid Inheritance</li>
</ul>

<p>Practice these concepts with PyLearn's OOP quizzes and sample programs!</p>`,
        excerpt: "Complete guide to Python OOP concepts including classes, objects, inheritance, and polymorphism. Essential for CBSE Class 12 Computer Science.",
        featuredImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
        author: "PyLearn Education Team",
        tags: ["Python", "OOP", "Classes", "Inheritance", "CBSE"],
        category: "Python Concepts",
        metaTitle: "Python OOP: Classes & Objects Guide for CBSE | PyLearn",
        metaDescription: "Master Python Object-Oriented Programming for CBSE Class 12. Learn classes, objects, inheritance types, and OOP concepts with examples.",
        metaKeywords: ["Python OOP", "Python classes", "inheritance Python", "CBSE OOP", "object oriented programming"],
        publishedAt: new Date("2024-02-10"),
        status: "published",
        isFeatured: false
    },
    {
        title: "How to Score 95+ in CBSE Class 12 Computer Science",
        slug: "score-95-plus-cbse-computer-science",
        content: `<h2>Your Roadmap to Excellence in Computer Science</h2>
<p>Scoring 95+ in CBSE Class 12 Computer Science is achievable with the right strategy. Here's a comprehensive guide based on previous years' patterns and expert recommendations.</p>

<h3>Understand the Marking Scheme</h3>
<p>Knowing how marks are distributed helps prioritize your preparation:</p>
<ul>
<li><strong>Theory (70 marks):</strong> Python programming, data structures, networking, database concepts</li>
<li><strong>Practical (30 marks):</strong> File handling, SQL queries, program execution</li>
</ul>

<h3>Chapter-wise Weightage</h3>
<p>Focus more on high-weightage chapters:</p>
<ul>
<li>Python programming (30-35 marks)</li>
<li>Data Structures - Stacks (10-12 marks)</li>
<li>Database Management (10-12 marks)</li>
<li>Computer Networks (8-10 marks)</li>
</ul>

<h3>Study Strategy</h3>

<h4>1. Start with Python Basics</h4>
<p>Build a strong foundation with variables, operators, and control structures. Use PyLearn's chapter-wise notes and quizzes.</p>

<h4>2. Master Data Structures</h4>
<p>Lists, dictionaries, and stacks are frequently tested. Practice implementation of stack using list.</p>

<h4>3. Focus on File Handling & CSV</h4>
<p>These topics appear in both theory and practical exams. Write programs for reading/writing CSV files.</p>

<h4>4. SQL Queries Practice</h4>
<p>Master all SQL commands - SELECT, INSERT, UPDATE, DELETE, JOIN operations. Practice writing queries for given scenarios.</p>

<h3>Exam Day Tips</h3>
<ul>
<li>Read the question paper thoroughly in the first 15 minutes</li>
<li>Start with questions you're most confident about</li>
<li>Write clean, indented code with comments</li>
<li>Don't leave any question unanswered</li>
<li>Manage time - don't spend too long on one question</li>
</ul>

<h3>Revision Strategy</h3>
<ul>
<li>Solve at least 5 previous year papers</li>
<li>Create a formula sheet for quick revision</li>
<li>Practice debugging code with errors</li>
<li>Revise PyLearn's summary notes 2 days before exam</li>
</ul>

<p>With dedication and the right resources, 95+ is within your reach. Download PyLearn12 and start your journey today!</p>`,
        excerpt: "Strategic guide to scoring 95+ in CBSE Class 12 Computer Science. Includes chapter-wise weightage, study strategy, and exam day tips.",
        featuredImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
        author: "Dr. Amit Kumar",
        tags: ["CBSE", "Exam Strategy", "Computer Science", "Class 12", "Study Tips"],
        category: "Exam Preparation",
        metaTitle: "How to Score 95+ in CBSE Class 12 Computer Science | PyLearn",
        metaDescription: "Complete strategy guide to score 95+ in CBSE Class 12 Computer Science. Chapter-wise weightage, study tips, and exam day strategies included.",
        metaKeywords: ["CBSE Computer Science", "Class 12 exam tips", "score 95 percent", "CBSE preparation", "computer science strategy"],
        publishedAt: new Date("2024-02-15"),
        status: "published",
        isFeatured: true
    }
];

async function seedBlogs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing blogs
        await Blog.deleteMany({});
        console.log('Cleared existing blogs');

        // Insert sample blogs
        const result = await Blog.insertMany(sampleBlogs);
        console.log(`Seeded ${result.length} blogs successfully`);

        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding blogs:', error);
        process.exit(1);
    }
}

seedBlogs();
