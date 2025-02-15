// Online C++ compiler to run C++ program online
#include <iostream>
using namespace std;
class one{
    public:
    int num;
    void print(){
        cout<<num;
    }
};
int main() {
    one obj1;
    obj1.num=30;
    obj1.print();
    return 0;
}