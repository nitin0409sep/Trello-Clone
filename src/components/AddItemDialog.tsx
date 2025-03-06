import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface AddItemDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  handleClose: (val: boolean) => void;
  handleAddCardItem: (value: string) => void;
  handleAddCard: (value: string) => void;
  isAddItem: boolean;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  setOpen,
  handleClose,
  handleAddCardItem,
  handleAddCard,
  isAddItem,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    setOpen(false);

    if (isAddItem) {
      handleAddCardItem(String(formJson.item));
    } else {
      handleAddCard(String(formJson.card));
    }
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
        <DialogTitle>{isAddItem ? "Item Value" : "Card Name"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name={isAddItem ? "item" : "card"}
            label={isAddItem ? "Item Value" : "Card Name"}
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
