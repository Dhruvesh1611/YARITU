#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {10, 20, 30};
    v.push_back(40); // Add at end
    v.insert(v.begin() + 1, 15); // Insert 15 at index 1
    v.pop_back(); // Remove last element

    for (int num : v) {
        cout << num << " ";
    }
    return 0;
}