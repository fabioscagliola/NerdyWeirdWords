using System.Diagnostics.Contracts;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace com.nerdyweirdwords.backend.WritingDomain;
public class Writing
{
 public Attribute[] Attributes { get; set; }
  public Block[] Blocks { get; set; }
}