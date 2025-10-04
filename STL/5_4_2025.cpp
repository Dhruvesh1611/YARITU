

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> scores = {85, 90, 78, 92, 88};

    // Sort scores in ascending order
    sort(scores.begin(), scores.end());

    cout << "Sorted scores: ";
    for (const auto& score : scores) {
        cout << score << " ";
    }

    return 0;
}