// #include <stdio.h>
// #include <string.h>
// int main() {
//     char str1[50] = "dhruvesh ";  
//     char str2[] = "shyara"
//     strcat(str1, str2);
    
//     printf("%s", str1);
    
//     return 0;
// }
// #include <stdio.h>


// int main() {
//      data(10.2);
    
//     return 0;
// }
// float data(float x){
//     printf("%f",x);
//     return x;
// }
// #include <stdio.h>

// // Function prototype (declaration)
// float data(float x);

// int main() {
//     data(10.2);  // Calling the function data()
    
//     return 0;
// }

// // Function definition
// float data(float x) {
//     printf("%f\n", x);  // Print the float value
//     return x;
// }
// #include <stdio.h>

// int main() {
//     int day;
//     printf("enter a number for day :");
//     scanf("%d", &day);
    
//     switch (day) {
//         case 1:
//             printf("Monday");
            
//         case 2:
//             printf("Tuesday\n");
            
//         case 3:
//             printf("Wednesday\n");
            
//         case 4:
//             printf("Thursday\n");
            
//         case 5:
//             printf("Friday\n");
            
//         case 6:
//             printf("Saturday\n");
            
//         case 7:
//             printf("Sunday\n");
           
//         default:
//             printf("Invalid day\n");
            

//     }

//     return 0;
// }



// #include <stdio.h>
// int main(){
// int i;
// for(i=1;i<101;i++){
//     if(i%3==0 && i%7==0){
//         printf("%d\n",i);
//     }
// }
// }

// #include <stdio.h>
// int main(){
// int i=1;
// while(i<101){
//     if(i%3==0 && i%7==0){
//         printf("%d\n",i);
//     }
//     i++;
// }
// }

// #include <stdio.h>

// int main() {
//     int i = 1;  
    
//     do {
      
//         if(i % 3 == 0 && i % 7 == 0) {
//             printf("%d\n", i); 
//         }
//         i++;  
//     } while(i < 101);  

//     return 0;
// }

// #include <stdio.h>
// int main() {
//     int number = 25;
//     (number >18) ? printf("user valid for dl") : printf("user not valid for dl");
//     return 0;
// }



// #include <stdio.h>

// int main() {
//     int i;
//     start:
    
//     for (i = 1; i <= 10; i++) {
//         if (i == 16) {
//             goto start;  
//         }
//         printf("%d\n", i);  
//     }
//     return 0;
    
// }

// #include <stdio.h>
// int factorial(int n) {
//     if (n == 0 || n == 1) {
//         return 1;  
//     } else {
//         return n * factorial(n - 1);  
//     }
// }


// int main() {
//     int number;
//     printf("Enter a number: ");
//     scanf("%d", &number);

    
//     int result = factorial(number);

    
//     printf("Factorial of %d is %d\n", number, result);

//     return 0;
// }



// #include <stdio.h>

// int main() {
//     int number ;
//     int result = 1;
//     int i;
//     printf("Enter a number: ");
//     scanf("%d", &number);
//     i = number;
//     factorial_loop:
//     if (i == 1) {
//         goto end;  
//     }
//     result *= i;  
//     i--;  
//     goto factorial_loop;  
//     end:
//     printf("Factorial of %d is %d\n", number, result);
//     return 0;
// }



// #include <stdio.h>
// int main() {
//     int arr[] = {1, 2, 3, 4};
//     for (int i = 0; i < 4; i++) {
//         printf("%d\n", arr[i]);  
//     }
//     return 0;
// }


// #include <stdio.h>
// int main() {
//     int arr[3][3] = {{1,2,3},
//                     {4,5,6}};
//             int sum=arr[i]+arr[j]
//     for (int i = 0; i < 3; i++) {
//         for(int j=0;j<3;j++){
//         printf("%d\n",sum );  
//         }
//     }
//     return 0;
// }


// #include <stdio.h>

// int main() {
//     int arr[3][3][3] = {
//         {{1, 2, 3},{4, 5, 6}},
//         {{1, 2, 3},{4, 5, 6}},
//         {{1, 2, 3},{4, 5, 6}}};

//     int sum = 0;  

    
//     for (int i = 0; i < 3; i++) {
//         for (int j = 0; j < 3; j++) {
//             sum += arr[i][j];  
//         }
//     }

    
//     printf("Sum = %d\n", sum);

//     return 0;
// }

#include <stdio.h>
void print_fibonacci(int n) {
    int a = 0, b = 1, next;
     n=6;
    if (6 >= 1) {
        printf("%d ", a);  
    }
    
    if (6 >= 2) {
        printf("%d ", b);  
    }

    for (int i = 3; i <= 6; i++) {
        next = a + b; 
        printf("%d ", next);
        a = b;  
        b = next;  
    }
}

int main() {
    print_fibonacci(6);
    return 0;
}

