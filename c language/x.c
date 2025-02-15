// #include <stdio.h>
// int main (){
//         int days=365;
//         printf("enter a number of days :");
//         scanf("%d",&days);
//         float month = days/30;
//         float year=days/365;
//         printf("days=%d\n",days);
//         printf("month=%.2f\n",month);
//         printf("year=%.2f\n",year);
// }


#include <stdio.h>
int main (){
    int i;
        for ( i = 0; i < 100; i++)
        {
            if(i%3==0){
            continue;   
            }
            printf("%d\n",i);
        }
        
}

