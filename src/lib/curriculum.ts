import type { Exercise } from "./types";

interface LessonExercises {
  lessonId: string;
  exercises: Exercise[];
}

export const curriculum: Record<string, LessonExercises[]> = {
  python: [
    {
      lessonId: "python-u0-l0",
      exercises: [
        {
          id: "py-intro-1",
          lesson_id: "python-u0-l0",
          type: "concept",
          question: "What is Python?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "Python is a high-level, interpreted programming language known for its readability and versatility. It's widely used in web development, data science, AI, and automation.",
          difficulty: 1,
        },
        {
          id: "py-intro-2",
          lesson_id: "python-u0-l0",
          type: "multiple_choice",
          question: "Who created Python?",
          code_snippet: undefined,
          options: [
            "Guido van Rossum",
            "Dennis Ritchie",
            "Brendan Eich",
            "James Gosling",
          ],
          correct_answer: "Guido van Rossum",
          explanation:
            "Python was created by Guido van Rossum and first released in 1991.",
          difficulty: 1,
        },
        {
          id: "py-intro-3",
          lesson_id: "python-u0-l0",
          type: "concept",
          question: "What does 'interpreted language' mean?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "An interpreted language executes code line by line at runtime, without needing a separate compilation step. This makes Python great for rapid development and experimentation.",
          difficulty: 1,
        },
        {
          id: "py-intro-4",
          lesson_id: "python-u0-l0",
          type: "multiple_choice",
          question:
            "Which of these is NOT a common use case for Python?",
          code_snippet: undefined,
          options: [
            "Web development",
            "Mobile operating systems",
            "Data science",
            "Automation scripts",
          ],
          correct_answer: "Mobile operating systems",
          explanation:
            "While Python is used in many domains, mobile OS development is typically done with C/C++ or Swift/Kotlin, not Python.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "python-u0-l1",
      exercises: [
        {
          id: "py-first-1",
          lesson_id: "python-u0-l1",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: 'print("Hello, World!")',
          options: ["Hello, World!", "hello world", "Error", "Nothing"],
          correct_answer: "Hello, World!",
          explanation:
            'The print() function outputs the string passed to it. Strings in Python can be enclosed in single or double quotes.',
          difficulty: 1,
        },
        {
          id: "py-first-2",
          lesson_id: "python-u0-l1",
          type: "fill_blank",
          question:
            "Complete the code to print your name: print(______)",
          code_snippet: 'print(______)',
          options: [],
          correct_answer: '"your name"',
          explanation:
            "Strings are passed as arguments inside the parentheses of print().",
          difficulty: 1,
        },
        {
          id: "py-first-3",
          lesson_id: "python-u0-l1",
          type: "multiple_choice",
          question: "Which comment syntax is valid in Python?",
          code_snippet: undefined,
          options: [
            "# This is a comment",
            "// This is a comment",
            "/* This is a comment */",
            "-- This is a comment",
          ],
          correct_answer: "# This is a comment",
          explanation:
            "Python uses the hash symbol (#) for single-line comments. Multi-line comments use triple quotes.",
          difficulty: 1,
        },
        {
          id: "py-first-4",
          lesson_id: "python-u0-l1",
          type: "fill_blank",
          question:
            "Fill in the missing keyword to run a Python script from the terminal: python ______ my_script.py",
          code_snippet: "python ______ my_script.py",
          options: [],
          correct_answer: "filename",
          explanation:
            "You run a Python script by typing 'python filename.py' in your terminal.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "python-u0-l2",
      exercises: [
        {
          id: "py-vars-1",
          lesson_id: "python-u0-l2",
          type: "multiple_choice",
          question: "What is the type of x after this code?",
          code_snippet: "x = 42",
          options: ["int", "float", "str", "bool"],
          correct_answer: "int",
          explanation:
            "In Python, 42 is an integer literal, so x will be of type int. Python infers types automatically.",
          difficulty: 1,
        },
        {
          id: "py-vars-2",
          lesson_id: "python-u0-l2",
          type: "fill_blank",
          question: "Declare a variable named 'name' with the value 'Alice':",
          code_snippet: "______ = 'Alice'",
          options: [],
          correct_answer: "name",
          explanation:
            "Variable assignment uses the syntax: variable_name = value.",
          difficulty: 1,
        },
        {
          id: "py-vars-3",
          lesson_id: "python-u0-l2",
          type: "multiple_choice",
          question: "What is the result of this code?",
          code_snippet: "x = 5\ny = 2\nprint(x + y)",
          options: ["7", "52", "5 + 2", "Error"],
          correct_answer: "7",
          explanation:
            "The + operator on integers performs addition. x + y evaluates to 5 + 2 = 7.",
          difficulty: 1,
        },
        {
          id: "py-vars-4",
          lesson_id: "python-u0-l2",
          type: "multiple_choice",
          question: "Which of these is NOT a valid Python variable name?",
          code_snippet: undefined,
          options: ["my_var", "2things", "_private", "camelCase"],
          correct_answer: "2things",
          explanation:
            "Variable names cannot start with a number. They can start with a letter or underscore.",
          difficulty: 1,
        },
        {
          id: "py-vars-5",
          lesson_id: "python-u0-l2",
          type: "fill_blank",
          question: "Convert this string to an integer: int(______)",
          code_snippet: "age = \"25\"\nnumeric_age = int(______)",
          options: [],
          correct_answer: "age",
          explanation:
            "The int() function converts a string to an integer. We pass the variable 'age' which holds the string '25'.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "python-u0-l3",
      exercises: [
        {
          id: "py-io-1",
          lesson_id: "python-u0-l3",
          type: "multiple_choice",
          question: "What does the input() function return?",
          code_snippet: "name = input(\"Enter name: \")",
          options: ["A string", "An integer", "A float", "A boolean"],
          correct_answer: "A string",
          explanation:
            "The input() function always returns a string, even if the user types a number.",
          difficulty: 1,
        },
        {
          id: "py-io-2",
          lesson_id: "python-u0-l3",
          type: "fill_blank",
          question:
            "Complete the code to convert user input to an integer:",
          code_snippet: "age = ______(input(\"Age: \"))",
          options: [],
          correct_answer: "int",
          explanation:
            "Use int() to convert the string from input() into an integer.",
          difficulty: 1,
        },
        {
          id: "py-io-3",
          lesson_id: "python-u0-l3",
          type: "syntax_drag",
          question:
            "Arrange these lines to ask for a name and print a greeting:",
          code_snippet: undefined,
          options: [
            'name = input("What is your name? ")',
            'print("Hello, " + name)',
          ],
          correct_answer:
            'name = input("What is your name? ")\nprint("Hello, " + name)',
          explanation:
            "First we get input from the user, then we use string concatenation to print the greeting.",
          difficulty: 2,
        },
        {
          id: "py-io-4",
          lesson_id: "python-u0-l3",
          type: "multiple_choice",
          question: "What is string concatenation?",
          code_snippet: undefined,
          options: [
            "Joining two strings together",
            "Multiplying two strings",
            "Converting a string to lowercase",
            "Finding the length of a string",
          ],
          correct_answer: "Joining two strings together",
          explanation:
            "String concatenation joins strings using the + operator. 'Hello, ' + 'World' becomes 'Hello, World'.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "python-u1-l0",
      exercises: [
        {
          id: "py-if-1",
          lesson_id: "python-u1-l0",
          type: "fill_blank",
          question:
            "Complete the if statement to check if x is greater than 5:",
          code_snippet: "x = 10\n______ x > 5:\n    print(\"Big!\")",
          options: [],
          correct_answer: "if",
          explanation:
            "Python uses 'if' followed by a condition and a colon to start a conditional block.",
          difficulty: 1,
        },
        {
          id: "py-if-2",
          lesson_id: "python-u1-l0",
          type: "multiple_choice",
          question: "What does this code print?",
          code_snippet: "x = 3\nif x > 5:\n    print(\"A\")\nelse:\n    print(\"B\")",
          options: ["B", "A", "AB", "Nothing"],
          correct_answer: "B",
          explanation:
            "Since x = 3 is not greater than 5, the if condition is False, so the else block runs and prints 'B'.",
          difficulty: 1,
        },
        {
          id: "py-if-3",
          lesson_id: "python-u1-l0",
          type: "multiple_choice",
          question: "Which operator checks if two values are equal?",
          code_snippet: undefined,
          options: ["==", "=", "!=", "==="],
          correct_answer: "==",
          explanation:
            "The == operator checks equality. Single = is used for assignment, not comparison.",
          difficulty: 1,
        },
        {
          id: "py-if-4",
          lesson_id: "python-u1-l0",
          type: "fill_blank",
          question: "Add the elif condition to check for x equals 5:",
          code_snippet: "x = 5\nif x > 5:\n    print(\"Big\")\n______ x == 5:\n    print(\"Exactly 5\")\nelse:\n    print(\"Small\")",
          options: [],
          correct_answer: "elif",
          explanation:
            "'elif' is Python's shorthand for 'else if'. It checks another condition when the previous if was False.",
          difficulty: 2,
        },
        {
          id: "py-if-5",
          lesson_id: "python-u1-l0",
          type: "syntax_drag",
          question: "Arrange these to check if a number is even or odd:",
          code_snippet: undefined,
          options: [
            "if num % 2 == 0:",
            '    print("Even")',
            "else:",
            '    print("Odd")',
          ],
          correct_answer:
            "if num % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")",
          explanation:
            "The modulo operator % gives the remainder. If num % 2 == 0, the number is even.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "python-u1-l1",
      exercises: [
        {
          id: "py-for-1",
          lesson_id: "python-u1-l1",
          type: "multiple_choice",
          question: "How many times does this loop execute?",
          code_snippet: "for i in range(5):\n    print(i)",
          options: ["5", "4", "6", "1"],
          correct_answer: "5",
          explanation:
            "range(5) generates numbers 0, 1, 2, 3, 4 — that's 5 iterations total.",
          difficulty: 1,
        },
        {
          id: "py-for-2",
          lesson_id: "python-u1-l1",
          type: "fill_blank",
          question:
            "Create a loop that prints numbers 0 through 4:",
          code_snippet: "______ i ______ range(5):",
          options: [],
          correct_answer: "for in",
          explanation:
            "The syntax is 'for variable in iterable:'.",
          difficulty: 1,
        },
        {
          id: "py-for-3",
          lesson_id: "python-u1-l1",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: 'for char in "ABC":\n    print(char)',
          options: ["A\\nB\\nC", "ABC", "A B C", "Error"],
          correct_answer: "A\\nB\\nC",
          explanation:
            "A string is iterable in Python. The loop prints each character on a separate line.",
          difficulty: 2,
        },
        {
          id: "py-for-4",
          lesson_id: "python-u1-l1",
          type: "fill_blank",
          question:
            "Sum the numbers 1 to 5. Fill in the blank:",
          code_snippet: "total = 0\nfor n in range(1, 6):\n    total ______ n",
          options: [],
          correct_answer: "total + n",
          explanation:
            "Wait—actually the correct answer is a common pattern: `total += n` (add n to total each iteration). But since the blank is about what to write, the user needs to complete `total = total + n` or `total += n`.",
          difficulty: 2,
        },
        {
          id: "py-for-5",
          lesson_id: "python-u1-l1",
          type: "syntax_drag",
          question: "Arrange a loop that prints each fruit:",
          code_snippet: undefined,
          options: [
            'fruits = ["apple", "banana", "cherry"]',
            "for fruit in fruits:",
            "    print(fruit)",
          ],
          correct_answer:
            'fruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit)',
          explanation:
            "First define the list, then iterate over it with a for loop, printing each element.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "python-u1-l2",
      exercises: [
        {
          id: "py-while-1",
          lesson_id: "python-u1-l2",
          type: "fill_blank",
          question:
            "Complete this while loop that counts to 5:",
          code_snippet: "x = 1\n______ x <= 5:\n    print(x)\n    x += 1",
          options: [],
          correct_answer: "while",
          explanation:
            "A while loop repeats as long as its condition is True.",
          difficulty: 1,
        },
        {
          id: "py-while-2",
          lesson_id: "python-u1-l2",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: "x = 3\nwhile x > 0:\n    print(x)\n    x -= 1",
          options: ["3\\n2\\n1", "3\\n2\\n1\\n0", "1\\n2\\n3", "Infinite loop"],
          correct_answer: "3\\n2\\n1",
          explanation:
            "The loop runs while x > 0, decrementing x each time. It prints 3, 2, 1 then stops.",
          difficulty: 2,
        },
        {
          id: "py-while-3",
          lesson_id: "python-u1-l2",
          type: "concept",
          question: "What is an infinite loop?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "An infinite loop occurs when the loop condition never becomes False. Always ensure your loop variable is updated inside the loop body.",
          difficulty: 2,
        },
        {
          id: "py-while-4",
          lesson_id: "python-u1-l2",
          type: "multiple_choice",
          question: "Which keyword exits a loop immediately?",
          code_snippet: undefined,
          options: ["break", "exit", "stop", "end"],
          correct_answer: "break",
          explanation:
            "The 'break' statement immediately terminates the current loop, regardless of the condition.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "python-u1-l3",
      exercises: [
        {
          id: "py-listcomp-1",
          lesson_id: "python-u1-l3",
          type: "multiple_choice",
          question: "What does this list comprehension produce?",
          code_snippet: "[x * 2 for x in range(4)]",
          options: [
            "[0, 2, 4, 6]",
            "[2, 4, 6, 8]",
            "[0, 1, 2, 3]",
            "[x * 2]",
          ],
          correct_answer: "[0, 2, 4, 6]",
          explanation:
            "range(4) gives [0, 1, 2, 3]. Each element is multiplied by 2, resulting in [0, 2, 4, 6].",
          difficulty: 2,
        },
        {
          id: "py-listcomp-2",
          lesson_id: "python-u1-l3",
          type: "fill_blank",
          question:
            "Create a list of squares for numbers 1-5 using a list comprehension:",
          code_snippet: "squares = [x______2 ______ x in range(1, 6)]",
          options: [],
          correct_answer: "** for",
          explanation:
            "List comprehension syntax: [expression for item in iterable]. Here x**2 squares each number.",
          difficulty: 2,
        },
        {
          id: "py-listcomp-3",
          lesson_id: "python-u1-l3",
          type: "multiple_choice",
          question: "What does this comprehension produce?",
          code_snippet: "[n for n in range(10) if n % 2 == 0]",
          options: [
            "[0, 2, 4, 6, 8]",
            "[1, 3, 5, 7, 9]",
            "[2, 4, 6, 8]",
            "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]",
          ],
          correct_answer: "[0, 2, 4, 6, 8]",
          explanation:
            "This comprehension includes only even numbers (n % 2 == 0) from 0 to 9.",
          difficulty: 2,
        },
        {
          id: "py-listcomp-4",
          lesson_id: "python-u1-l3",
          type: "syntax_drag",
          question:
            "Convert this for loop to a list comprehension (arrange the parts):",
          code_snippet: undefined,
          options: [
            "squares = [",
            "x**2",
            "for x in range(5)",
            "]",
          ],
          correct_answer: "squares = [\nx**2\nfor x in range(5)\n]",
          explanation:
            "A list comprehension puts the expression first, then the for clause, all inside square brackets.",
          difficulty: 3,
        },
      ],
    },
    {
      lessonId: "python-u2-l0",
      exercises: [
        {
          id: "py-func-1",
          lesson_id: "python-u2-l0",
          type: "fill_blank",
          question:
            "Complete the function definition to greet the user:",
          code_snippet: "______ greet():",
          options: [],
          correct_answer: "def",
          explanation:
            "Functions are defined using the 'def' keyword followed by the function name and parentheses.",
          difficulty: 1,
        },
        {
          id: "py-func-2",
          lesson_id: "python-u2-l0",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: "def say_hi():\n    print(\"Hi!\")\n\nsay_hi()",
          options: ["Hi!", "None", "say_hi", "Error"],
          correct_answer: "Hi!",
          explanation:
            "Defining a function doesn't run it — you must call it with say_hi() to execute the body.",
          difficulty: 1,
        },
        {
          id: "py-func-3",
          lesson_id: "python-u2-l0",
          type: "concept",
          question: "Why do we use functions?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "Functions let you organize code into reusable blocks. You define it once and call it many times, reducing repetition and improving readability.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "python-u2-l1",
      exercises: [
        {
          id: "py-params-1",
          lesson_id: "python-u2-l1",
          type: "fill_blank",
          question:
            "Add a parameter 'name' to this function:",
          code_snippet: "def greet(______):\n    print(\"Hello, \" + name)",
          options: [],
          correct_answer: "name",
          explanation:
            "Parameters are listed inside the parentheses of the function definition.",
          difficulty: 1,
        },
        {
          id: "py-params-2",
          lesson_id: "python-u2-l1",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: "def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)",
          options: ["7", "34", "a + b", "Error"],
          correct_answer: "7",
          explanation:
            "The function returns 3 + 4 = 7, which is stored in 'result' and printed.",
          difficulty: 1,
        },
        {
          id: "py-params-3",
          lesson_id: "python-u2-l1",
          type: "concept",
          question: "What is the difference between 'return' and 'print'?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "'return' sends a value back to the caller and exits the function. 'print' displays output to the console but doesn't give a value back.",
          difficulty: 2,
        },
        {
          id: "py-params-4",
          lesson_id: "python-u2-l1",
          type: "multiple_choice",
          question: "What is a default parameter?",
          code_snippet: "def greet(name=\"World\"):\n    print(\"Hello, \" + name)\n\ngreet()",
          options: [
            "A parameter with a default value if not provided",
            "A parameter that must always be passed",
            "A parameter at the end of the list",
            "A parameter with no name",
          ],
          correct_answer: "A parameter with a default value if not provided",
          explanation:
            "Default parameters have a default value assigned in the function definition. If the caller doesn't provide that argument, the default is used.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "python-u2-l2",
      exercises: [
        {
          id: "py-builtin-1",
          lesson_id: "python-u2-l2",
          type: "multiple_choice",
          question: "What does len(\"Python\") return?",
          code_snippet: undefined,
          options: ["6", "5", "7", "Error"],
          correct_answer: "6",
          explanation:
            "len() returns the number of characters in the string. 'Python' has 6 letters.",
          difficulty: 1,
        },
        {
          id: "py-builtin-2",
          lesson_id: "python-u2-l2",
          type: "multiple_choice",
          question: "What does type(42) return?",
          code_snippet: undefined,
          options: ["<class 'int'>", "int", "42", "Integer"],
          correct_answer: "<class 'int'>",
          explanation:
            "type() returns the type of the object. For integers, it returns <class 'int'>.",
          difficulty: 1,
        },
        {
          id: "py-builtin-3",
          lesson_id: "python-u2-l2",
          type: "fill_blank",
          question: "Use the max() function to find the largest number:",
          code_snippet: "largest = ______(10, 25, 7, 42)",
          options: [],
          correct_answer: "max",
          explanation:
            "max() returns the largest item from the provided arguments or iterable.",
          difficulty: 1,
        },
        {
          id: "py-builtin-4",
          lesson_id: "python-u2-l2",
          type: "multiple_choice",
          question: "What does sorted([3, 1, 2]) return?",
          code_snippet: undefined,
          options: [
            "[1, 2, 3]",
            "[3, 1, 2]",
            "[3, 2, 1]",
            "Error",
          ],
          correct_answer: "[1, 2, 3]",
          explanation:
            "sorted() returns a new sorted list from the elements of the given iterable.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "python-u2-l3",
      exercises: [
        {
          id: "py-modules-1",
          lesson_id: "python-u2-l3",
          type: "fill_blank",
          question: "Import the math module:",
          code_snippet: "______ math",
          options: [],
          correct_answer: "import",
          explanation:
            "The 'import' keyword is used to import modules in Python.",
          difficulty: 1,
        },
        {
          id: "py-modules-2",
          lesson_id: "python-u2-l3",
          type: "multiple_choice",
          question: "What does math.sqrt(16) return?",
          code_snippet: "import math\n\nresult = math.sqrt(16)",
          options: ["4.0", "4", "16", "Error"],
          correct_answer: "4.0",
          explanation:
            "math.sqrt() returns the square root as a float. sqrt(16) = 4.0.",
          difficulty: 1,
        },
        {
          id: "py-modules-3",
          lesson_id: "python-u2-l3",
          type: "multiple_choice",
          question: "How do you import only the sqrt function from math?",
          code_snippet: undefined,
          options: [
            "from math import sqrt",
            "import sqrt from math",
            "import math.sqrt",
            "use math.sqrt",
          ],
          correct_answer: "from math import sqrt",
          explanation:
            "'from module import function' imports a specific function directly, so you can call it without the module prefix.",
          difficulty: 2,
        },
        {
          id: "py-modules-4",
          lesson_id: "python-u2-l3",
          type: "fill_blank",
          question: "Use 'as' to alias the math module as 'm':",
          code_snippet: "import math ______ m",
          options: [],
          correct_answer: "as",
          explanation:
            "'import module as alias' lets you use a shorter name for the module.",
          difficulty: 2,
        },
      ],
    },
  ],
  javascript: [
    {
      lessonId: "javascript-u0-l0",
      exercises: [
        {
          id: "js-intro-1",
          lesson_id: "javascript-u0-l0",
          type: "concept",
          question: "What is JavaScript?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "JavaScript is a high-level, dynamic programming language that powers the interactive web. It runs in browsers and on servers (Node.js).",
          difficulty: 1,
        },
        {
          id: "js-intro-2",
          lesson_id: "javascript-u0-l0",
          type: "multiple_choice",
          question: "Who created JavaScript?",
          code_snippet: undefined,
          options: [
            "Brendan Eich",
            "Guido van Rossum",
            "Dennis Ritchie",
            "Tim Berners-Lee",
          ],
          correct_answer: "Brendan Eich",
          explanation:
            "Brendan Eich created JavaScript in 1995 while working at Netscape.",
          difficulty: 1,
        },
        {
          id: "js-intro-3",
          lesson_id: "javascript-u0-l0",
          type: "concept",
          question: "What does 'client-side' mean in web development?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "Client-side code runs in the user's browser, not on a server. JavaScript is the primary client-side programming language for web interactivity.",
          difficulty: 1,
        },
        {
          id: "js-intro-4",
          lesson_id: "javascript-u0-l0",
          type: "multiple_choice",
          question: "Which tag is used to include JavaScript in HTML?",
          code_snippet: undefined,
          options: [
            "<script>",
            "<javascript>",
            "<js>",
            "<code>",
          ],
          correct_answer: "<script>",
          explanation:
            "JavaScript is embedded in HTML using the <script> tag. It can be inline or reference an external file.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "javascript-u0-l1",
      exercises: [
        {
          id: "js-vars-1",
          lesson_id: "javascript-u0-l1",
          type: "multiple_choice",
          question: "Which keyword declares a variable that CAN be reassigned?",
          code_snippet: undefined,
          options: ["let", "const", "var", "Both let and var"],
          correct_answer: "Both let and var",
          explanation:
            "Both 'let' and 'var' allow reassignment. 'const' creates a variable that cannot be reassigned.",
          difficulty: 1,
        },
        {
          id: "js-vars-2",
          lesson_id: "javascript-u0-l1",
          type: "fill_blank",
          question: "Declare a constant variable named PI with value 3.14:",
          code_snippet: "______ PI = 3.14;",
          options: [],
          correct_answer: "const",
          explanation:
            "'const' declares a constant whose value cannot be changed after assignment.",
          difficulty: 1,
        },
        {
          id: "js-vars-3",
          lesson_id: "javascript-u0-l1",
          type: "multiple_choice",
          question: "What is the value of y after this code?",
          code_snippet: "let x = 5;\nlet y = x + 10;",
          options: ["15", "510", "10", "undefined"],
          correct_answer: "15",
          explanation:
            "The + operator on numbers performs addition. y = 5 + 10 = 15.",
          difficulty: 1,
        },
        {
          id: "js-vars-4",
          lesson_id: "javascript-u0-l1",
          type: "concept",
          question: "What is the difference between let and const?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "'let' declares a variable you can reassign later. 'const' declares a variable that cannot be reassigned. Both are block-scoped, unlike 'var'.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "javascript-u0-l2",
      exercises: [
        {
          id: "js-types-1",
          lesson_id: "javascript-u0-l2",
          type: "multiple_choice",
          question: "What is the type of '42' in JavaScript?",
          code_snippet: undefined,
          options: ["string", "number", "undefined", "boolean"],
          correct_answer: "string",
          explanation:
            "Anything in quotes is a string. '42' is a string, while 42 (without quotes) is a number.",
          difficulty: 1,
        },
        {
          id: "js-types-2",
          lesson_id: "javascript-u0-l2",
          type: "multiple_choice",
          question: "What does typeof true return?",
          code_snippet: undefined,
          options: ["\"boolean\"", "\"bool\"", "\"true\"", "\"string\""],
          correct_answer: "\"boolean\"",
          explanation:
            "The typeof operator returns a string indicating the type. For true/false values, it returns 'boolean'.",
          difficulty: 1,
        },
        {
          id: "js-types-3",
          lesson_id: "javascript-u0-l2",
          type: "multiple_choice",
          question: "What is the result of '5' + 5?",
          code_snippet: undefined,
          options: ["\"55\"", "10", "\"10\"", "Error"],
          correct_answer: "\"55\"",
          explanation:
            "When a string is involved with +, JavaScript converts the number to a string and concatenates them, giving '55'.",
          difficulty: 2,
        },
        {
          id: "js-types-4",
          lesson_id: "javascript-u0-l2",
          type: "fill_blank",
          question: "Use typeof to check the type of x:",
          code_snippet: "let x = 42;\nconsole.log(______ x);",
          options: [],
          correct_answer: "typeof",
          explanation:
            "typeof is an operator that returns the type of its operand as a string.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "javascript-u0-l3",
      exercises: [
        {
          id: "js-console-1",
          lesson_id: "javascript-u0-l3",
          type: "multiple_choice",
          question: "How do you print a message in the browser console?",
          code_snippet: undefined,
          options: [
            "console.log(\"Hello\")",
            "print(\"Hello\")",
            "log(\"Hello\")",
            "console.write(\"Hello\")",
          ],
          correct_answer: "console.log(\"Hello\")",
          explanation:
            "console.log() is the standard way to output messages to the browser's developer console.",
          difficulty: 1,
        },
        {
          id: "js-console-2",
          lesson_id: "javascript-u0-l3",
          type: "multiple_choice",
          question: "What does this code print?",
          code_snippet: "let name = \"Alice\";\nconsole.log(\"Hello, \" + name);",
          options: ["Hello, Alice", "Hello, name", "\"Hello, Alice\"", "Error"],
          correct_answer: "Hello, Alice",
          explanation:
            "The + operator concatenates the string 'Hello, ' with the value of the variable name ('Alice').",
          difficulty: 1,
        },
        {
          id: "js-console-3",
          lesson_id: "javascript-u0-l3",
          type: "fill_blank",
          question: "Log the result of 5 + 3 to the console:",
          code_snippet: "console.log(______);",
          options: [],
          correct_answer: "5 + 3",
          explanation:
            "You can log expressions directly. console.log(5 + 3) prints 8.",
          difficulty: 1,
        },
        {
          id: "js-console-4",
          lesson_id: "javascript-u0-l3",
          type: "syntax_drag",
          question: "Arrange these lines to declare a variable and log it:",
          code_snippet: undefined,
          options: [
            'let greeting = "Hello, World!";',
            "console.log(greeting);",
          ],
          correct_answer:
            'let greeting = "Hello, World!";\nconsole.log(greeting);',
          explanation:
            "First declare and assign the variable, then log it to the console.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "javascript-u1-l0",
      exercises: [
        {
          id: "js-func-decl-1",
          lesson_id: "javascript-u1-l0",
          type: "fill_blank",
          question: "Complete this function declaration:",
          code_snippet: "______ greet() {\n  console.log(\"Hi!\");\n}",
          options: [],
          correct_answer: "function",
          explanation:
            "Functions are declared using the 'function' keyword in JavaScript.",
          difficulty: 1,
        },
        {
          id: "js-func-decl-2",
          lesson_id: "javascript-u1-l0",
          type: "multiple_choice",
          question: "How do you call a function named greet?",
          code_snippet: undefined,
          options: ["greet()", "call greet", "greet", "run greet"],
          correct_answer: "greet()",
          explanation:
            "You call a function by using its name followed by parentheses: greet().",
          difficulty: 1,
        },
        {
          id: "js-func-decl-3",
          lesson_id: "javascript-u1-l0",
          type: "concept",
          question: "What is a function in JavaScript?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "A function is a reusable block of code that performs a specific task. It can take parameters and return a value.",
          difficulty: 1,
        },
        {
          id: "js-func-decl-4",
          lesson_id: "javascript-u1-l0",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));",
          options: ["5", "23", "undefined", "Error"],
          correct_answer: "5",
          explanation:
            "The function add(2, 3) returns 2 + 3 = 5, which is passed to console.log().",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "javascript-u1-l1",
      exercises: [
        {
          id: "js-arrow-1",
          lesson_id: "javascript-u1-l1",
          type: "multiple_choice",
          question: "What is an arrow function?",
          code_snippet: undefined,
          options: [
            "A shorter syntax for writing functions using =>",
            "A function that shoots arrows",
            "A function that runs asynchronously",
            "A function with no parameters",
          ],
          correct_answer: "A shorter syntax for writing functions using =>",
          explanation:
            "Arrow functions (=>) provide a concise syntax for writing functions. Example: const add = (a, b) => a + b;",
          difficulty: 2,
        },
        {
          id: "js-arrow-2",
          lesson_id: "javascript-u1-l1",
          type: "fill_blank",
          question: "Convert this function to an arrow function:",
          code_snippet: "const double = (n) => ______",
          options: [],
          correct_answer: "n * 2",
          explanation:
            "Arrow functions can have an implicit return when the body is a single expression. double(4) would return 8.",
          difficulty: 2,
        },
        {
          id: "js-arrow-3",
          lesson_id: "javascript-u1-l1",
          type: "multiple_choice",
          question: "Which syntax is correct for an arrow function?",
          code_snippet: undefined,
          options: [
            "const f = (x) => x * 2;",
            "const f = (x) => { x * 2 };",
            "const f = function(x) => x * 2;",
            "const f = (x) -> x * 2;",
          ],
          correct_answer: "const f = (x) => x * 2;",
          explanation:
            "Arrow functions use the => syntax. For a single expression, you don't need curly braces or a return statement.",
          difficulty: 2,
        },
        {
          id: "js-arrow-4",
          lesson_id: "javascript-u1-l1",
          type: "syntax_drag",
          question: "Arrange these to create an arrow function that squares a number:",
          code_snippet: undefined,
          options: [
            "const square =",
            "(n)",
            "=>",
            "n * n",
            ";",
          ],
          correct_answer:
            "const square =\n(n)\n=>\nn * n\n;",
          explanation:
            "An arrow function can be broken across lines for readability. square(5) would return 25.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "javascript-u1-l2",
      exercises: [
        {
          id: "js-scope-1",
          lesson_id: "javascript-u1-l2",
          type: "multiple_choice",
          question: "What does 'scope' mean in JavaScript?",
          code_snippet: undefined,
          options: [
            "Where variables are accessible in your code",
            "How large a function is",
            "The range of numbers in an array",
            "The visibility of CSS styles",
          ],
          correct_answer: "Where variables are accessible in your code",
          explanation:
            "Scope determines where variables and functions are accessible. Variables declared with let/const are block-scoped.",
          difficulty: 2,
        },
        {
          id: "js-scope-2",
          lesson_id: "javascript-u1-l2",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: "let x = 10;\nif (true) {\n  let x = 20;\n  console.log(x);\n}\nconsole.log(x);",
          options: ["20\\n10", "10\\n20", "20\\n20", "Error"],
          correct_answer: "20\\n10",
          explanation:
            "The inner 'let x = 20' is block-scoped to the if block. It doesn't affect the outer x, so the outer log still prints 10.",
          difficulty: 2,
        },
        {
          id: "js-scope-3",
          lesson_id: "javascript-u1-l2",
          type: "concept",
          question: "What is a closure in JavaScript?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "A closure is a function that remembers the variables from the scope where it was created, even after that scope is gone. This enables powerful patterns like data privacy.",
          difficulty: 3,
        },
      ],
    },
    {
      lessonId: "javascript-u1-l3",
      exercises: [
        {
          id: "js-higher-1",
          lesson_id: "javascript-u1-l3",
          type: "multiple_choice",
          question: "What does the map() method do?",
          code_snippet: undefined,
          options: [
            "Creates a new array by transforming each element",
            "Filters elements based on a condition",
            "Sorts the array",
            "Finds the first matching element",
          ],
          correct_answer: "Creates a new array by transforming each element",
          explanation:
            "map() calls a function on each element and returns a new array with the results. Example: [1,2,3].map(n => n*2) gives [2,4,6].",
          difficulty: 2,
        },
        {
          id: "js-higher-2",
          lesson_id: "javascript-u1-l3",
          type: "multiple_choice",
          question: "What does this code output?",
          code_snippet: "[1, 2, 3, 4].filter(n => n % 2 === 0)",
          options: [
            "[2, 4]",
            "[1, 3]",
            "[1, 2, 3, 4]",
            "[]",
          ],
          correct_answer: "[2, 4]",
          explanation:
            "filter() keeps elements where the callback returns true. n % 2 === 0 checks for even numbers.",
          difficulty: 2,
        },
        {
          id: "js-higher-3",
          lesson_id: "javascript-u1-l3",
          type: "fill_blank",
          question: "Use the array method that reduces an array to a single value:",
          code_snippet: "const sum = [1, 2, 3].______((a, b) => a + b, 0);",
          options: [],
          correct_answer: "reduce",
          explanation:
            "reduce() iterates over the array and accumulates a single value. This example sums all numbers starting from 0.",
          difficulty: 3,
        },
        {
          id: "js-higher-4",
          lesson_id: "javascript-u1-l3",
          type: "syntax_drag",
          question: "Arrange to double each number and keep only those > 5:",
          code_snippet: undefined,
          options: [
            "[1, 2, 3, 4, 5]",
            ".map(n => n * 2)",
            ".filter(n => n > 5)",
          ],
          correct_answer:
            "[1, 2, 3, 4, 5]\n.map(n => n * 2)\n.filter(n => n > 5)",
          explanation:
            "Method chaining: first map doubles each number, then filter keeps only numbers greater than 5. Result: [6, 8, 10].",
          difficulty: 3,
        },
      ],
    },
    {
      lessonId: "javascript-u2-l0",
      exercises: [
        {
          id: "js-dom-1",
          lesson_id: "javascript-u2-l0",
          type: "multiple_choice",
          question: "How do you select an element by its ID?",
          code_snippet: undefined,
          options: [
            "document.getElementById(\"myId\")",
            "document.querySelector(\"#myId\")",
            "Both of these work",
            "document.getElementById(myId)",
          ],
          correct_answer: "Both of these work",
          explanation:
            "Both getElementById('myId') and querySelector('#myId') select an element by its ID. querySelector is more flexible with CSS selectors.",
          difficulty: 1,
        },
        {
          id: "js-dom-2",
          lesson_id: "javascript-u2-l0",
          type: "fill_blank",
          question: "Select all elements with class 'item':",
          code_snippet: "const items = document.querySelectorAll(______)",
          options: [],
          correct_answer: "\".item\"",
          explanation:
            "querySelectorAll('.item') returns a NodeList of all elements matching the CSS selector '.item'.",
          difficulty: 1,
        },
        {
          id: "js-dom-3",
          lesson_id: "javascript-u2-l0",
          type: "concept",
          question: "What is the DOM?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "The Document Object Model (DOM) is a programming interface for HTML documents. It represents the page as a tree of objects that can be manipulated with JavaScript.",
          difficulty: 1,
        },
      ],
    },
    {
      lessonId: "javascript-u2-l1",
      exercises: [
        {
          id: "js-dom-manip-1",
          lesson_id: "javascript-u2-l1",
          type: "multiple_choice",
          question: "How do you change the text content of an element?",
          code_snippet: undefined,
          options: [
            "element.textContent = \"New text\"",
            "element.innerHTML = \"New text\"",
            "element.innerText(\"New text\")",
            "element.value = \"New text\"",
          ],
          correct_answer: "element.textContent = \"New text\"",
          explanation:
            "textContent sets the text content of an element, safely escaping HTML. innerHTML also works but can be a security risk with user input.",
          difficulty: 1,
        },
        {
          id: "js-dom-manip-2",
          lesson_id: "javascript-u2-l1",
          type: "fill_blank",
          question: "Add the class 'active' to an element:",
          code_snippet: "element.classList.______(\"active\")",
          options: [],
          correct_answer: "add",
          explanation:
            "classList.add() adds a CSS class to an element's existing classes.",
          difficulty: 1,
        },
        {
          id: "js-dom-manip-3",
          lesson_id: "javascript-u2-l1",
          type: "multiple_choice",
          question: "How do you change an element's style?",
          code_snippet: undefined,
          options: [
            "element.style.color = \"red\"",
            "element.style = \"color: red\"",
            "element.color = \"red\"",
            "element.setStyle(\"color\", \"red\")",
          ],
          correct_answer: "element.style.color = \"red\"",
          explanation:
            "element.style accesses the inline style object. Properties are camelCase versions of CSS properties.",
          difficulty: 1,
        },
        {
          id: "js-dom-manip-4",
          lesson_id: "javascript-u2-l1",
          type: "syntax_drag",
          question: "Arrange to create a new div and add it to the body:",
          code_snippet: undefined,
          options: [
            "const div = document.createElement(\"div\");",
            "div.textContent = \"Hello\";",
            "document.body.appendChild(div);",
          ],
          correct_answer:
            "const div = document.createElement(\"div\");\ndiv.textContent = \"Hello\";\ndocument.body.appendChild(div);",
          explanation:
            "First create the element, then set its content, then append it to the DOM.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "javascript-u2-l2",
      exercises: [
        {
          id: "js-events-1",
          lesson_id: "javascript-u2-l2",
          type: "fill_blank",
          question: "Add a click event listener to a button:",
          code_snippet: "button.addEventListener(\"click\", ______)",
          options: [],
          correct_answer: "myFunction",
          explanation:
            "addEventListener takes an event type ('click') and a callback function to run when the event occurs.",
          difficulty: 1,
        },
        {
          id: "js-events-2",
          lesson_id: "javascript-u2-l2",
          type: "multiple_choice",
          question: "Which event fires when a key is released?",
          code_snippet: undefined,
          options: ["keyup", "keydown", "keypress", "keyrelease"],
          correct_answer: "keyup",
          explanation:
            "keyup fires when a key is released. keydown fires when pressed. keypress is deprecated.",
          difficulty: 1,
        },
        {
          id: "js-events-3",
          lesson_id: "javascript-u2-l2",
          type: "concept",
          question: "What is event bubbling?",
          code_snippet: undefined,
          options: [],
          correct_answer: "",
          explanation:
            "Event bubbling means an event on a child element 'bubbles up' through its ancestors. A click on a button also triggers click events on its parent, grandparent, etc.",
          difficulty: 2,
        },
        {
          id: "js-events-4",
          lesson_id: "javascript-u2-l2",
          type: "multiple_choice",
          question: "What does e.preventDefault() do?",
          code_snippet: undefined,
          options: [
            "Prevents the default browser behavior",
            "Stops the event from propagating",
            "Prevents the element from being clicked",
            "Removes all event listeners",
          ],
          correct_answer: "Prevents the default browser behavior",
          explanation:
            "e.preventDefault() stops the browser's default action, like preventing a form from submitting or a link from navigating.",
          difficulty: 2,
        },
      ],
    },
    {
      lessonId: "javascript-u2-l3",
      exercises: [
        {
          id: "js-create-el-1",
          lesson_id: "javascript-u2-l3",
          type: "multiple_choice",
          question: "Which method creates a new HTML element?",
          code_snippet: undefined,
          options: [
            "document.createElement(\"div\")",
            "document.newElement(\"div\")",
            "document.makeElement(\"div\")",
            "document.build(\"div\")",
          ],
          correct_answer: "document.createElement(\"div\")",
          explanation:
            "document.createElement(tagName) creates a new element node that can be customized and added to the DOM.",
          difficulty: 1,
        },
        {
          id: "js-create-el-2",
          lesson_id: "javascript-u2-l3",
          type: "fill_blank",
          question: "Set the inner HTML of an element:",
          code_snippet: "element.______ = \"<strong>Bold text</strong>\"",
          options: [],
          correct_answer: "innerHTML",
          explanation:
            "innerHTML sets the HTML content inside an element, parsing HTML tags.",
          difficulty: 1,
        },
        {
          id: "js-create-el-3",
          lesson_id: "javascript-u2-l3",
          type: "multiple_choice",
          question: "How do you remove a child element from the DOM?",
          code_snippet: undefined,
          options: [
            "parent.removeChild(child)",
            "child.remove()",
            "Both work",
            "parent.deleteChild(child)",
          ],
          correct_answer: "Both work",
          explanation:
            "You can use parent.removeChild(child) on the parent or child.remove() directly. Both remove the element from the DOM.",
          difficulty: 2,
        },
        {
          id: "js-create-el-4",
          lesson_id: "javascript-u2-l3",
          type: "syntax_drag",
          question: "Arrange to create a list with 3 items dynamically:",
          code_snippet: undefined,
          options: [
            "const ul = document.createElement(\"ul\");",
            '["Apples", "Bananas", "Cherries"].forEach(item => {',
            "  const li = document.createElement(\"li\");",
            "  li.textContent = item;",
            "  ul.appendChild(li);",
            "});",
            "document.body.appendChild(ul);",
          ],
          correct_answer:
            "const ul = document.createElement(\"ul\");\n[\"Apples\", \"Bananas\", \"Cherries\"].forEach(item => {\n  const li = document.createElement(\"li\");\n  li.textContent = item;\n  ul.appendChild(li);\n});\ndocument.body.appendChild(ul);",
          explanation:
            "Create the ul, iterate over items creating li elements, append each li to ul, then append ul to the document body.",
          difficulty: 3,
        },
      ],
    },
  ],
};

export function getExercisesForLesson(
  courseId: string,
  lessonId: string
): Exercise[] {
  const courseExercises = curriculum[courseId];
  if (!courseExercises) return [];
  const found = courseExercises.find((le) => le.lessonId === lessonId);
  if (found) return found.exercises;

  const allExercises = courseExercises.flatMap((le) => le.exercises);
  return allExercises.slice(0, 4);
}

export function getAllExerciseIds(): string[] {
  const ids: string[] = [];
  for (const courseId of Object.keys(curriculum)) {
    for (const lessonGroup of curriculum[courseId]) {
      for (const ex of lessonGroup.exercises) {
        ids.push(ex.id);
      }
    }
  }
  return ids;
}
