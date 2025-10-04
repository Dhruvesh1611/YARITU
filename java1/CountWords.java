import java.util.Scanner;

public class CountWords {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a sentence: ");
        String input = scanner.nextLine();

        if (input.trim().isEmpty()) {
            System.out.println("Number of words: 0");
        } else {
            String[] words = input.trim().split("\\s+");
            System.out.println("Number of words: " + words.length);
        }

        scanner.close();
    }
}