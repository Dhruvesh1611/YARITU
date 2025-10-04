#include <iostream>
#include <vector>

using namespace std;


class Node {
public:
    int val;
    Node* prev;
    Node* next;
    Node* child;

    Node(int _val) {
        val = _val;
        prev = nullptr;
        next = nullptr;
        child = nullptr;
    }
};

class Solution {
public:
    Node* flatten(Node* head) {
        Node* temp = head;
        while (temp != nullptr) {
            if (temp->child == nullptr) {
                temp = temp->next;
            } else {
                Node* tail = temp->child;
                while (tail->next != nullptr) {
                    tail = tail->next;
                }
                tail->next = temp->next;
                if (temp->next != nullptr) {
                    temp->next->prev = tail;
                }
                temp->next = temp->child;
                temp->child->prev = temp;
                temp->child = nullptr;
            }
        }
        return head;
    }
};


void printList(Node* head) {
    while (head) {
        cout << head->val << " -> ";
        head = head->next;
    }
    cout << "null" << endl;
}

