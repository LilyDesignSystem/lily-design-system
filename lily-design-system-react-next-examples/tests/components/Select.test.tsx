import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Select from "@lily/Select";
import Option from "@lily/Option";

describe("Select", () => {
    test("renders a combobox", () => {
        render(
            <Select label="Choose">
                <Option value="a">Alpha</Option>
                <Option value="b">Beta</Option>
            </Select>
        );
        const select = screen.getByLabelText("Choose");
        expect(select).toBeTruthy();
    });

    test("renders options", () => {
        render(
            <Select label="Pick one">
                <Option value="x">X</Option>
                <Option value="y">Y</Option>
            </Select>
        );
        expect(screen.getByText("X")).toBeTruthy();
        expect(screen.getByText("Y")).toBeTruthy();
    });
});
