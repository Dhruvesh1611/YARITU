#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // 1. Count the frequency of each element
        unordered_map<int, int> freqMap;
        for (int num : nums) {
            freqMap[num]++;
        }

        // 2. Move the map data to a vector of pairs for sorting
        vector<pair<int, int>> freqVec;
        for (auto const& [num, freq] : freqMap) {
            freqVec.push_back({num, freq});
        }

        // 3. Sort the vector by frequency in descending order
        sort(freqVec.begin(), freqVec.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
            return a.second > b.second;
        });

        // 4. Extract the top k elements
        vector<int> result;
        for (int i = 0; i < k; ++i) {
            result.push_back(freqVec[i].first);
        }

        return result;
    }
};

// Helper function to print a vector
void printVector(const vector<int>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        cout << vec[i];
        if (i < vec.size() - 1) {
            cout << ",";
        }
    }
    cout << "]" << endl;
}

int main() {
    Solution sol;

    // Example 1
    vector<int> nums1 = {1, 1, 1, 2, 2, 3};
    int k1 = 2;
    vector<int> result1 = sol.topKFrequent(nums1, k1);
    cout << "Example 1 Input: nums = [1,1,1,2,2,3], k = 2" << endl;
    cout << "Output: ";
    printVector(result1); // Expected: [1,2]
    cout << endl;

    // Example 2
    vector<int> nums2 = {1};
    int k2 = 1;
    vector<int> result2 = sol.topKFrequent(nums2, k2);
    cout << "Example 2 Input: nums = [1], k = 1" << endl;
    cout << "Output: ";
    printVector(result2); // Expected: [1]
    cout << endl;

    // Example 3
    vector<int> nums3 = {1, 2, 1, 2, 1, 2, 3, 1, 3, 2};
    int k3 = 2;
    vector<int> result3 = sol.topKFrequent(nums3, k3);
    cout << "Example 3 Input: nums = [1,2,1,2,1,2,3,1,3,2], k = 2" << endl;
    cout << "Output: ";
    printVector(result3); // Expected: [1,2]
    cout << endl;

    return 0;
}
