namespace com.nerdyweirdwords.backend.PersonDomain;

#nullable disable

public class Person
{
    public Guid Id { get; init; }

    public string Email { get; init; }

    public string FName { get; init; }

    public string LName { get; init; }
}