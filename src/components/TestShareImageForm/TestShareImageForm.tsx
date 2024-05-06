import { Label } from "../../@/components/ui/label";
import React from "react";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";

export const TestShareImageForm = () => (
  <form
    className="form flex flex-col gap-3"
    action="./share-item"
    encType="multipart/form-data"
    method="POST"
  >
    <div>
      <Label htmlFor="file">Select images:</Label>
      <Input type="file" id="file" name="file" />
    </div>
    <div>
      <Label htmlFor="file">Title</Label>
      <Input
        type="text"
        id="title"
        name="title"
        placeholder="title"
        defaultValue="Jumper"
      />
    </div>
    <div>
      <Label htmlFor="text">Text</Label>
      <Input
        type="text"
        id="text"
        name="text"
        placeholder="text"
        defaultValue="https://www.google.com"
      />
    </div>
    <div>
      <Label htmlFor="url">Url</Label>
      <Input
        type="text"
        id="url"
        name="url"
        placeholder="url"
        defaultValue="https://www.google.com"
      />
    </div>
    <Button type="submit">Upload</Button>
  </form>
);
