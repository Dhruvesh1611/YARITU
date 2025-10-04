#include <iostream>
using namespace std;

// Base class
class Animal {
public:
    void speak() {
        cout << "Animal speaks!" << endl;
    }
};

// Derived class
class Dog : public Animal {
public:
    void bark() {
        cout << "Dog barks!" << endl;
    }
};

int main() {
    Dog dog;
    dog.speak(); // Inherited function
    dog.bark();  // Derived class function
    return 0;
}
