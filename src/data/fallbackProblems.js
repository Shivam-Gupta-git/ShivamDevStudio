/**
 * Fallback practice problems used by the frontend if backend API is loading or offline.
 */

export const FALLBACK_PROBLEMS = [
  {
    id: 'sum-two-numbers',
    title: 'Sum of Two Numbers',
    difficulty: 'Easy',
    category: 'Basics',
    description:
      'Read two integers from input and print their sum. Input is two space-separated numbers on one line.',
    examples: [
      { input: '5 3', output: '8' },
      { input: '10 20', output: '30' },
    ],
    testCases: [
      { input: '5 3', expectedOutput: '8' },
      { input: '10 20', expectedOutput: '30' },
      { input: '-4 9', expectedOutput: '5' },
      { input: '0 0', expectedOutput: '0' },
    ],
    starterCode: {
      javascript: `// Read two numbers from stdin and print their sum
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
const [a, b] = input.split(/\\s+/).map(Number);
console.log(a + b);`,
      python: `# Read two numbers and print their sum
a, b = map(int, input().split())
print(a + b)`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`,
    },
  },
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'Easy',
    category: 'Strings',
    description: 'Read a string from input and print it reversed.',
    examples: [
      { input: 'hello', output: 'olleh' },
      { input: 'React', output: 'tcaeR' },
    ],
    testCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'React', expectedOutput: 'tcaeR' },
      { input: 'a', expectedOutput: 'a' },
      { input: '12345', expectedOutput: '54321' },
    ],
    starterCode: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf8').trim();
console.log(s.split('').reverse().join(''));`,
      python: `s = input().strip()
print(s[::-1])`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(new StringBuilder(s).reverse().toString());
    }
}`,
      cpp: `#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    reverse(s.begin(), s.end());
    cout << s;
    return 0;
}`,
    },
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    difficulty: 'Easy',
    category: 'Loops',
    description:
      'Read an integer N. Print numbers 1 to N, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz". Each result on a new line.',
    examples: [
      { input: '5', output: '1\n2\nFizz\n4\nBuzz' },
      { input: '3', output: '1\n2\nFizz' },
    ],
    testCases: [
      { input: '5', expectedOutput: '1\n2\nFizz\n4\nBuzz' },
      { input: '3', expectedOutput: '1\n2\nFizz' },
      { input: '15', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' },
    ],
    starterCode: {
      javascript: `const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf8').trim(), 10);
for (let i = 1; i <= n; i++) {
  if (i % 15 === 0) console.log('FizzBuzz');
  else if (i % 3 === 0) console.log('Fizz');
  else if (i % 5 === 0) console.log('Buzz');
  else console.log(i);
}`,
      python: `n = int(input())
for i in range(1, n + 1):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) cout << "FizzBuzz\\n";
        else if (i % 3 == 0) cout << "Fizz\\n";
        else if (i % 5 == 0) cout << "Buzz\\n";
        else cout << i << "\\n";
    }
    return 0;
}`,
    },
  },
  {
    id: 'find-maximum',
    title: 'Find Maximum',
    difficulty: 'Medium',
    category: 'Arrays',
    description:
      'First line: integer N (count). Second line: N space-separated integers. Print the maximum value.',
    examples: [
      { input: '5\n3 7 2 9 1', output: '9' },
      { input: '3\n-1 -5 -2', output: '-1' },
    ],
    testCases: [
      { input: '5\n3 7 2 9 1', expectedOutput: '9' },
      { input: '3\n-1 -5 -2', expectedOutput: '-1' },
      { input: '1\n42', expectedOutput: '42' },
      { input: '4\n10 10 10 10', expectedOutput: '10' },
    ],
    starterCode: {
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[1].split(/\\s+/).map(Number);
console.log(Math.max(...nums));`,
      python: `n = int(input())
nums = list(map(int, input().split()))
print(max(nums))`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val > max) max = val;
        }
        System.out.println(max);
    }
}`,
      cpp: `#include <iostream>
#include <climits>
using namespace std;

int main() {
    int n, val, maxVal = INT_MIN;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> val;
        if (val > maxVal) maxVal = val;
    }
    cout << maxVal;
    return 0;
}`,
    },
  },
]

export function getFallbackProblem(id) {
  return FALLBACK_PROBLEMS.find((p) => p.id === id) || FALLBACK_PROBLEMS[0]
}
