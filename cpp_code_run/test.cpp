// open and read file

// #include <iostream>
// #include <fstream>
// using namespace std;

// int main() {
//     ifstream inFile("data.txt");
//     string line;
//     if (inFile.is_open()) {
//         while (getline(inFile, line)) {
//             cout << line << endl;
//         }
//         inFile.close();
//     } else {
//         cout << "Error opening file." << endl;
//     }
//     return 0;
// }

// #include <iostream>
// #include <fstream>
// using namespace std;

// int main() {
//     ofstream outFile("data.txt"); // Create and open file
//     if (outFile.is_open()) {
//         outFile << "Hello, this is a test file!" << endl;
//         outFile << "File handling in C++ is very useful.";
//         outFile.close();
//         cout << "Data written successfully." << endl;
//     } else {
//         cout << "Error opening file." << endl;
//     }
//     return 0;
// }




// #include <iostream>
// #include <fstream>
// using namespace std;

// int main() {
//     ofstream outFile("data.txt", ios::app); // Open in append mode
//     if (outFile.is_open()) {
//         outFile << "\nThis line is appended!" << endl;
//         outFile << "More info added without erasing previous content." << endl;
//         outFile.close();
//         cout << "Data appended successfully." << endl;
//     } else {
//         cout << "Error opening file." << endl;
//     }
//     return 0;
// }




// #include <iostream>
// #include <fstream>
// using namespace std;

// int main() {
//     ifstream inFile("data.txt");
//     string line;
//     if (inFile.is_open()) {
//         while (getline(inFile, line)) {
//             cout << line << endl;
//         }
//         inFile.close();
//     } else {
//         cout << "Error opening file." << endl;
//     }
//     return 0;
// }


#include <iostream>
#include <fstream>
using namespace std;

int main() {
    fstream file("data.txt", ios::in);
    if (file.is_open()) {
        file.seekg(10, ios::beg); // Move to 10th character
        char ch;
        file.get(ch);
        cout << "Character at position 10: " << ch << endl;
        file.close();
    } else {
        cout << "Error opening file." << endl;
    }
    return 0;
}