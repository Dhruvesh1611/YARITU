1.
// function calculator(num1,num2,opretor){
//     let ans;
//     if(opretor=='+')
//     {
//         ans=num1+num2
//     }
//     else if(opretor=='-')
//     {
//         ans=num1-num2
//     }
//     else if(opretor=='*')
//     {
//         ans=num1*num2
//     }
//     else if(opretor=='/')
//     {
//         if(num2!=0){
//             ans=num1/num2
//         }
//         else
//         {
//             console.log("num2 can not be zero")
//         }
//     }
//     else
//     {
//         console.log("invalid")
//     }
//     console.log("result="+ans)
// }

// calculator(10,20,'*')

// 2.Student Grade Object: Create an object student with properties name, scores (an array of numbers), and calculateAverage (a method that calculates and logs the average score).
// student={
//     name:"dhruvesh",
//     score:[10,20,30],
//     calculateavg:function(){
//         var sum=0;
//         let length=this.score.length;
//         for(var i=0;i<length;i++)
//         {
//             sum=sum+this.score[i]
//         }
//         console.log("total sum=",sum)
//         let avg=sum/length;
//         console.log("Average =", avg);  // Log the average as well

//     }
   
// }
// student.calculateavg();

// setTimeout((){
//     console.log("hello")
// },2000);
// let count = 5
// var countDown = setInterval(()=>{
//     if(count >0)
//     { 
//         console.log(count);
//         count --;
//     }
// else
//     {
//     console.log("GO!"); 
//     clearInterval(countDown);
//     } 
// },1000)


// function doubleArray(arr){
//     var newArr = [];
//     var length = arr.length;
//     for(var i =0 ;i<length ;i++)
//     {
//     newArr.push(arr[i]*2);
//     }
//     console.log(newArr); }
//     let arr = [1,2,3,4,5,6];
//      doubleArray(arr);
    

// function small_number(array){
//     for(var i =0;i<array.length;i++){
//     for(var j =i+1;j<array.length;j++)
//         { 
//             if(array[i]>array[j])
//                 {
//                     var digit = array[i]; array[i] = array[j]; array[j]= digit
//                 }
//         }
//     }
//     console.log(array[1]) }
//     let arr =[10,3,90,7,4]
    //  small_number(arr);

    // console.log(`I am ${user.person.name}, ${user.person.age} year old , from ${user.address.city}, ${user.address.country} .`);
    // 9. Sum of Odd Numbers: Write a function that takes an array of numbers, sums only the odd numbers, and logs the result.
    // function sum_oddNum(arr){ var sum = 0;
    // for(var i =0;i<arr.length ; i++){
    // if(arr[i] % 2 != 0){ sum += arr[i];
    // } }
    // console.log(sum); }
    // var arr = [2,6,5,5]; sum_oddNum(arr);
    // 10. Sum of Fibonacci Sequence: Write a function that calculates the sum of the first 10 numbers in the Fibonacci sequence and logs it.
    // function sum_fib(n){
    // var first = 0;
    // var sec = 1;
    // for(var i =0 ; i<n-1;i++){
    // var sum = first + sec ;
    // console.log(` ${first} + ${sec} = ${sum}`); first = sec ;
    // sec = sum ;
    // } }
    // sum_fib(10);
    // 11. Generate Multiplication Table: Write a function that generates and logs the multiplication table of a given number up to 10.
    // function table_till(n){
    // for(var i =1 ; i< n;i++){ for(var j =1 ; j<=10 ; j++){
    // var mul = i*j;
    // console.log(`${i} * ${j} = ${mul}`); }
    // console.log(); }
    // } table_till(10);
    // 12. Object Destructuring: Create an object representing a car (with properties like make, model, year). Use destructuring to extract each property into a variable and log them.
    // let car ={ model: "audi", year: 2017
    // }
    // var {model,year} = car; console.log(model); console.log(year);
    // 13. Default Parameter with Arrow Function: Write an arrow function that calculates the area of a rectangle with default width and height values if none are provided.
    // let rectangle_area = (width = 6 ,height=9) => { return width * height ;
    // };
    // let area1 = rectangle_area(); console.log(area1);
    // let area2 = rectangle_area(2,6); console.log(area2);
