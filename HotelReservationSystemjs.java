import java.util.*;

class Room {
    int roomNumber;
    String category;
    boolean isAvailable;
    double price;

    Room(int roomNumber, String category, double price) {
        this.roomNumber = roomNumber;
        this.category = category;
        this.price = price;
        this.isAvailable = true;
    }

    @Override
    public String toString() {
        return "Room " + roomNumber + " [" + category + "] - $" + price + " - " +
                (isAvailable ? "Available" : "Booked");
    }
}

class Booking {
    int bookingId;
    String guestName;
    Room room;
    Date bookingDate;

    Booking(int bookingId, String guestName, Room room, Date bookingDate) {
        this.bookingId = bookingId;
        this.guestName = guestName;
        this.room = room;
        this.bookingDate = bookingDate;
    }

    @Override
    public String toString() {
        return "Booking ID: " + bookingId +
                "\nGuest: " + guestName +
                "\nRoom: " + room.roomNumber + " (" + room.category + ")" +
                "\nDate: " + bookingDate.toString();
    }
}

public class HotelReservationSystemjs {
    private static List<Room> rooms = new ArrayList<>();
    private static Map<Integer, Booking> bookings = new HashMap<>();
    private static int nextBookingId = 1;
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        initRooms();
        int choice;
        do {
            System.out.println("\n--- Hotel Reservation System ---");
            System.out.println("1. View Available Rooms");
            System.out.println("2. Make Reservation");
            System.out.println("3. View Booking Details");
            System.out.println("4. Exit");
            System.out.print("Enter choice: ");
            choice = scanner.nextInt();
            scanner.nextLine();  // consume newline
            switch (choice) {
                case 1 -> viewAvailableRooms();
                case 2 -> makeReservation();
                case 3 -> viewBookingDetails();
                case 4 -> System.out.println("Thank you for using our system.");
                default -> System.out.println("Invalid choice.");
            }
        } while (choice != 4);
    }

    private static void initRooms() {
        rooms.add(new Room(101, "Single", 50.0));
        rooms.add(new Room(102, "Single", 50.0));
        rooms.add(new Room(201, "Double", 80.0));
        rooms.add(new Room(202, "Double", 80.0));
        rooms.add(new Room(301, "Suite", 150.0));
    }

    private static void viewAvailableRooms() {
        System.out.println("\n--- Available Rooms ---");
        for (Room room : rooms) {
            if (room.isAvailable) {
                System.out.println(room);
            }
        }
    }

    private static void makeReservation() {
        System.out.println("\n--- Make Reservation ---");
        viewAvailableRooms();
        System.out.print("Enter room number to book: ");
        int roomNum = scanner.nextInt();
        scanner.nextLine();  // consume newline

        Room selectedRoom = null;
        for (Room room : rooms) {
            if (room.roomNumber == roomNum && room.isAvailable) {
                selectedRoom = room;
                break;
            }
        }

        if (selectedRoom == null) {
            System.out.println("Invalid or unavailable room number.");
            return;
        }

        System.out.print("Enter guest name: ");
        String guestName = scanner.nextLine();

        System.out.println("Processing payment of $" + selectedRoom.price + "...");
        System.out.println("Payment successful.");

        selectedRoom.isAvailable = false;
        Booking booking = new Booking(nextBookingId++, guestName, selectedRoom, new Date());
        bookings.put(booking.bookingId, booking);
        System.out.println("Booking successful! Your booking ID is: " + booking.bookingId);
    }

    private static void viewBookingDetails() {
        System.out.print("Enter booking ID: ");
        int bookingId = scanner.nextInt();
        scanner.nextLine();  // consume newline

        Booking booking = bookings.get(bookingId);
        if (booking != null) {
            System.out.println("\n--- Booking Details ---");
            System.out.println(booking);
        } else {
            System.out.println("Booking not found.");
        }
    }
}
