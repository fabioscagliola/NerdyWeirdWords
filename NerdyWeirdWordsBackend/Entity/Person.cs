namespace com.nerdyweirdwords.backend.Entity;

public class Person
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PHash { get; set; }
    public string FName { get; set; }
    public string LName { get; set; }
}