import { validateForm } from "../app/util";

const ALLOWED = [".md"];

describe("validateForm", () => {
    it("throws if title is empty", () => {
        const fakeFile = new File(["x"], "a.md", { type: "text/markdown" });
        expect(() => validateForm("", fakeFile, ALLOWED))
            .toThrow("You must indicate a title!");
    });

    it("throws if writing is null", () => {
        expect(() => validateForm("Title", null, ALLOWED))
            .toThrow("You must upload a file!");
    });

    it("throws if writing is not a File", () => {
        expect(() => validateForm("Title", "nope" as any, ALLOWED))
            .toThrow("You must upload a file!");
    });

    it("throws if extension not allowed", () => {
        const fakeFile = new File(["x"], "a.txt", { type: "text/plain" });
        expect(() => validateForm("Title", fakeFile, ALLOWED))
            .toThrow("The file type must be one of: .md");
    });

    it("passes on valid input", () => {
        const fakeFile = new File(["x"], "a.md", { type: "text/markdown" });
        expect(() => validateForm("Title", fakeFile, ALLOWED)).not.toThrow();
    });
});
