using Microsoft.AspNetCore.Http;

namespace com.nerdyweirdwords.backend.WritingDomain.UploadWriting;

public class UploadWritingIncoming
{
    public IFormFile? Writing { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
}