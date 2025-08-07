import { ContactTypeDto, type IContactDto } from "@/api/SwaggerSdk";
import { Modal } from "@/components/Modal";
import { Select } from "@/components/Select";
import { TextInput } from "@/components/TextInput";
import { useEffect, useState } from "react";
import { contactTypeOptions } from "./ContactsContainer";
import { isDefined } from "@/helpers/isDefined";
import { useUpdateContact } from "@/hooks/contact/useUpdateContact";
import { Button } from "@/components/Button";

type EditContactModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contact: IContactDto;
};

const getInitialStateFromContact = (contact: IContactDto) => ({
  type: contact.type,
  value: contact.value,
  checked: contact.checked,
  contactedFromEmail: contact.contactedFromEmail,
  isOnWhatsapp: contact.isOnWhatsapp,
});

type errorsType = {
  type?: string[];
  value?: string[];
  checked?: string[];
  contactedFromEmail?: string[];
  isOnWhatsapp?: string[];
};

export const EditContactModal = ({ isOpen, setIsOpen, contact }: EditContactModalProps) => {
  const [formState, setFormState] = useState(getInitialStateFromContact(contact));
  const [errors, setErrors] = useState<errorsType>({});

  useEffect(() => {
    setFormState(getInitialStateFromContact(contact));
    setErrors({});
  }, [contact]);

  const handleCancel = () => {
    setFormState(getInitialStateFromContact(contact));
    setErrors({});
    setIsOpen(false);
  };

  const validate = () => {
    const newErrors: errorsType = {};

    if (!formState.value?.trim()) newErrors.value = [...(newErrors["value"] ?? []), "Identifier is required."];

    if (formState.type === ContactTypeDto.Email) {
      if (!isValidEmail(formState.value)) {
        newErrors.value = [...(newErrors["value"] ?? []), "Enter a valid email."];
      }

      if (formState.contactedFromEmail?.trim()) {
        if (!isValidEmail(formState.contactedFromEmail))
          newErrors.contactedFromEmail = [
            ...(newErrors["contactedFromEmail"] ?? []),
            "Must be valid email or nothing at all",
          ];
      }
    }

    if (formState.type) setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateContactMutation = useUpdateContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("submitting...", formState);

    if (!isDefined(contact.companyId) || !isDefined(contact.id)) return;

    const mutateParams = {
      compId: contact.companyId,
      contactId: contact.id,
      contact: { ...contact, ...formState },
    };
    updateContactMutation.mutate(mutateParams);
    setIsOpen(false);
  };

  return (
    <Modal ariaDescription="Edit Contact" title="Update contact yo!" open={isOpen} onOpenChange={setIsOpen} size="sm">
      <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
        <label className="flex flex-col items-start">
          Type
          <Select
            onValueChange={(val) => setFormState({ ...formState, type: val })}
            value={formState.type}
            options={contactTypeOptions}
            triggerClassName="min-w-30"
            contentClassName="z-z-popover"
          />
        </label>
        <label>
          Identifier
          <TextInput value={formState.value} onChange={(val) => setFormState({ ...formState, value: val })}></TextInput>
          {/* {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>} */}
          {errors.value?.map((err, idx) => (
            <p key={idx} className="text-danger-500 text-sm">
              {err}
            </p>
          ))}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formState.checked ?? false}
            onChange={(e) => setFormState({ ...formState, checked: e.target.checked })}
          />
          Checked
        </label>

        {formState.type === ContactTypeDto.Email && (
          <label>
            Contacted from email
            <TextInput
              value={formState.contactedFromEmail}
              onChange={(val) => setFormState({ ...formState, contactedFromEmail: val })}
            ></TextInput>
            {errors.contactedFromEmail?.map((err, idx) => (
              <p key={idx} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </label>
        )}
        {formState.type === ContactTypeDto.PhoneNumber && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formState.isOnWhatsapp ?? false}
              onChange={(e) => setFormState({ ...formState, isOnWhatsapp: e.target.checked })}
            />
            Is on WhatsApp
          </label>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
        {/* <button type="submit" className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"> */}
        {/* Save
        </button> */}
      </form>
    </Modal>
  );
};

const isValidEmail = (email: string | undefined): boolean => {
  if (!isDefined(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
