#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {10, 20, 30}; // C++11 feature
    for (int num : v) {
        cout << num << " ";
    }
    cout << endl;
    return 0;
}
