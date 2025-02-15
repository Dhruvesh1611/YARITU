// 1.Write a program to display “Hello Computer” on the screen.
#include <stdio.h>
int main(){
    printf("Hello Computer");
}

//2.Write a C program to display Your Name, Address and City in different lines.
#include <stdio.h>
int main(){
    printf("Dhruvesh shyara\n");
    printf("motavarachha surat\n");
    printf("surat");
}
// 3. Write a C program to find the area of a circle using the formula: Area = PI * r.
#include <stdio.h>
int main(){
    float r=10;
    float pi=3.14;
    float area=pi*r;
    printf("%.2f",area);
}
// 4. Write a C program to print the multiply, addition, division & subtraction value of two accepted numbers.
#include <stdio.h>
int main(){
    int a=10;int b=20;
    float multiply=a*b;
    float addition=a+b;
    float division=a/b;
    float subtraction=a-b;
    printf("a*b= %.1f \n",multiply);
    printf("a+b= %.1f \n",addition);
    printf("a/b= %.1f \n",division);
    printf("a-b= %.1f \n",subtraction);
}
// 5. Write a C program to swap a variable value of no1 and no2.
    #include <stdio.h>
        int main(){
            int a=10;
            int b=20;
            int c;
            c=a;
            a=b;
            b=c;
            printf("a=%d b=%d",a,b);

        }
// 6. Write a program to find a maximum from given two numbers.
#include <stdio.h>
int main(){
        int a=10;
        int b=20;
        if(a>b){
            printf("%d is maximum",a);
        }
        else{
            printf("%d is  maximum",b);

        }
    }
// 7. Write a program to find a minimum from given two numbers.
#include <stdio.h>
int main(){
        int a=10;
        int b=20;
        if(a<b){
            printf("%d is minimum",a);
        }
        else{
            printf("%d is  minimum",b);

        }
    }
// 8. Write a program to find a maximum from given three numbers.
#include <stdio.h>
int main(){
        int a=10;
        int b=20;
        int c=30;
        if(a>b && a>c){
            printf("%d is maximum",a);
        }
         else if(b>c && b>a){
            printf("%d is maximum",b);
        }
        else{
            printf("%d is  maximum",c);

        }
    }
// 9. Write a program to find a minimum from given three numbers.
int main(){
        int a=10;
        int b=20;
        int c=30;
        if(a<b && a<c){
            printf("%d is minimum",a);
        }
         else if(b<c && b<a){
            printf("%d is minimum",b);
        }
        else{
            printf("%d is  minimum",c);

        }
    }
// 10. Write a C program to print a multiplication table from 1 to 12.
#include <stdio.h>
int main() {
    int i, j;
    for (i = 1; i <= 12; i++) {
        printf("Multiplication table for %d:\n", i);
        for (j = 1; j <= 10; j++) {
            int table=i*j;
            printf("%d x %d = %d\n", i, j,table);

        }
        
    }
     
    return 0;
}

// 11. Write a C program to find addition of 45 to 65 using loop.
#include <stdio.h>
int main() {
    int i, j;
     int sum=0;
    for (i = 45; i <= 65; i++) {
             sum=sum+i;
        }
        printf("%d\n",sum);
    }
    
// 12. Write a C program to check whether a number is prime or not.
#include <stdio.h>
int main() {
    int num;
    printf("enter a number:");
    scanf("%d",& num);
    int count=0;
    
    for(int i=2;i<num;i++){
        if(num%i==0){
            count++;
        }
    }
    if(count<1){
        printf("%d is a prime number",num);
    }
    else{
        printf("%d is not a prime number",num);
    }
}


// 13. Write a C program to show month using Switch statement.
    #include <stdio.h>
    int main() {
        int month;
        printf("enter a number for month:");
        scanf("%d", &month);
        switch(month){
            case 1:{
                printf("january");
                break;
            }
            case 2:{
                printf("february");
                break;
            }
            case 3:{
                printf("march");
                break;
            }
            case 4:{
                printf("april");
                break;
            }
            case 5:{
                printf("may");
                break;
            }
            case 6:{
                printf("june");
                break;
            }
            case 7:{
                printf("july");
                break;
            }
            case 8:{
                printf("augst");
                break;
            }
            case 9:{
                printf("september");
                break;
            }
            case 10:{
                printf("october");
                break;
            }
            case 11:{
                printf("november");
                break;
            }
            case 12:{
                printf("december");
                break;
            }
            default:
            {
            printf("enter valid input");
            }
        }
    }
// 14. Write a C program to print the 3x3 array.
#include <stdio.h>

int main() {
    int arr[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", arr[i][j]);  
        }
        printf("\n");
    }
}

// 15. Write C program to print range of 101 to 130 using array.
#include <stdio.h>
int main() {
    int arr[30];
    for (int i = 0; i < 30; i++) {
        arr[i] = 101 + i;
    }
    for (int i = 0; i < 30; i++) {
        printf("%d \n", arr[i]);
    }
}
// 16. Write a C program to find the length of the given string.
 #include <stdio.h>
int main() {
    int arr[30];
    for (int i = 0; i < 30; i++) {
        arr[i] = 101 + i;
    }
    for (int i = 0; i < 30; i++) {
        printf("%d \n", arr[i]);
    }
}
// 17. Write a C program to copy one string into another string.
#include <stdio.h>
#include <string.h>
int main() {
    char str1[50]="hello ";
    char str2[]="dhruvesh";
    strcpy(str1,str2);
    printf("%s",str1);
    return 0;
}
// 18. Write a C program to concate (merge) the two strings.
#include <stdio.h>
#include <string.h>
int main() {
    char str1[50]="hello ";
    char str2[]="dhruvesh";
    strcat(str1,str2);
    printf("%s",str1);
    return 0;
}
// 19. Write a C program to print the following shape. 
* * * *
 * * *
  * *
   *
#include <stdio.h>

int main() {
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < i; j++) {
            printf(" ");
        }
        for (int k = 4 - i; k > 0; k--) {
            printf("* ");
        }
        printf("\n");
    }
    return 0;
}

// 20. Write a C program to find the addition of two values using function.
#include <stdio.h>
int add(int a, int b) {
    return a + b;
}
int main() {
    int num1, num2, sum;
    printf("Enter first number: ");
    scanf("%d", &num1);

    printf("Enter second number: ");
    scanf("%d", &num2);
        sum = add(num1, num2);
    printf("%d + %d = %d\n", num1, num2, sum);

    return 0;
}


