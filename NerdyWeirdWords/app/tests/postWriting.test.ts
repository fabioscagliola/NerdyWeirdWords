import { postWriting} from "../postWriting";

describe("validateAndUpload", () => {
  const validFile = new File(["# markdown"], "test.md", { type: "text/markdown" });

  beforeEach(() => {
    global.fetch = jest.fn(); // resettiamo ogni volta
  });

  test("should return error if file is missing", async () => {
    const result = await postWriting({ title: "Hello" });
    expect(result).toBe("400 : You must indicate a file!");
  });

  test("should return error if file has wrong extension", async () => {
    const badFile = new File(["text"], "bad.txt", { type: "text/plain" });
    const result = await postWriting({ writing: badFile, title: "Test" });
    expect(result).toBe("400 : Invalid file type! Supported file types: md");
  });

  test("should return error if title is missing", async () => {
    const result = await postWriting({ writing: validFile });
    expect(result).toBe("400 : You must indicate a title!");
  });

  test("should call fetch and return null if upload succeeds", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const result = await postWriting({ writing: validFile, title: "Good file" });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  test("should return error if upload fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => "Server error",
    });

    const result = await postWriting({ writing: validFile, title: "Bad upload" });
    expect(result).toBe(" 500 : Upload failed: Server error");
  });
});
