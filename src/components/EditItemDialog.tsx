import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface EditItemDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  handleClose: (val: boolean) => void;
  isEditItem: boolean;
}

export const EditItemDialog: React.FC<EditItemDialogProps> = ({
  open,
  setOpen,
  handleClose,
  isEditItem,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    setOpen(false);

    console.log(isEditItem);

    console.log(String(formJson.item));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: handleSubmit,
          },
        }}
      >
        <DialogTitle>"Item Value" </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="item"
            label="Item Value"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
