import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@heroui/react";
import type { ReactNode } from "react";

interface DeleteModalProps{
  header:ReactNode,
    content:ReactNode,
    isOpen: boolean,
    onOpenChange: () => void,
    children:ReactNode
}
export default function ConfirmModal({isOpen,onOpenChange,children,content,header}: DeleteModalProps) {

  return (
    <>
      <Modal backdrop="blur"  className=" !border !border-black/20 bg-white dark:bg-gray-800 " isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-center gap-1 text-black dark:text-white font-montserrat font-semibold text-2xl text-danger">{header}</ModalHeader>
              <ModalBody className="flex items-center justify-center">
                <p className="font-nunito text-md text-black dark:text-white">{content}</p>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center ">
                {children}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
