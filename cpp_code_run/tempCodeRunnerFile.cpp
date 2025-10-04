#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ofstream outFile("data.txt"); // Create and open file
    if (outFile.is_open()) {
        outFile << "Hello, this is a test file!" << endl;
        outFile << "File handling in C++ is very useful.";
        outFile.close();
        cout << "Data written successfully." << endl;
    } else {
        cout << "Error opening file." << endl;
    }
    return 0;
}