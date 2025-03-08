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
  handleItemEdit: (id: number, idx: number, itemValue: string) => void;
  cardId: number;
  itemId: number;
  item: string
}

export const EditItemDialog: React.FC<EditItemDialogProps> = ({
  open,
  setOpen,
  handleClose,
  handleItemEdit,
  cardId,
  itemId,
  item
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    setOpen(false);

    handleItemEdit(cardId, itemId, String(formJson.item));
  };

  const [itemValue, setItemValue] = React.useState(item);

  const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemValue(event.target.value);
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
        <DialogTitle>Edit Item Value</DialogTitle>
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
            value={itemValue}
            onChange={handleItemChange} 
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
