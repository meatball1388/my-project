using System;

class Program
{
    static void Main()
    {
        Console.Write("Введите номер билета (6 цифр): ");
        string ticket = Console.ReadLine();

        if (ticket.Length != 6 || !int.TryParse(ticket, out _))
        {
            Console.WriteLine("Ошибка: введите ровно 6 цифр.");
            return;
        }

        int leftSum = 0, rightSum = 0;

        for (int i = 0; i < 3; i++)
        {
            leftSum += ticket[i] - '0';
            rightSum += ticket[i + 3] - '0';
        }

        if (leftSum == rightSum)
            Console.WriteLine("Счастливый билет!");
        else
            Console.WriteLine("Обычный билет.");
    }
}
