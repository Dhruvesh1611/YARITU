#include <iostream>
#include <vector>
#include <stack>

using namespace std;

// Definition for a Node.
class Node
{
public:
    int val;
    Node *prev;
    Node *next;
    Node *child;

    Node(int _val)
    {
        val = _val;
        prev = nullptr;
        next = nullptr;
        child = nullptr;
    }
};

class Solution
{
public:
    Node *flatten_list(Node *head)
    {
        if (!head)
        {
            return nullptr;
        }

        stack<Node *> st;
        Node *current = head;

        while (current != nullptr)
        {
            if (current->child != nullptr)
            {

                if (current->next != nullptr)
                {
                    st.push(current->next);
                }

                current->next = current->child;
                current->next->prev = current;
                current->child = nullptr;
            }

            if (current->next == nullptr && !st.empty())
            {
                Node *nextNode = st.top();
                st.pop();

                current->next = nextNode;
                nextNode->prev = current;
            }

            current = current->next;
        }
        return head;
    }
};
