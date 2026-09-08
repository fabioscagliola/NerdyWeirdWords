using FluentValidation;

namespace com.nerdyweirdwords.backend.WritingDomain.UploadWriting;

public class UploadWritingIncomingValidator : AbstractValidator<UploadWritingIncoming>
{
    private static readonly string[] allowedExtensions = ["md"];

    public UploadWritingIncomingValidator()
    {
        RuleFor(incoming => incoming.Writing)
            .NotNull()
            .Must(file => file is not null && file.Length > 0)
            .WithMessage("Where's the writing?")
            .Must(file => file is not null && string.Equals(Path.GetExtension(file.FileName), ".md", StringComparison.OrdinalIgnoreCase))
            .WithMessage($"We only accept these file types: {string.Join(", ", allowedExtensions)}");

        RuleFor(incoming => incoming.Title)
            .NotEmpty()
            .Must(title => !string.IsNullOrWhiteSpace(title))
            .WithMessage("Where's the title?");
    }
}