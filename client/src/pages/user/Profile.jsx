import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { PencilIcon } from "lucide-react";
const Profile = ({
  formData,
  handleChange,
  setIsEditing,
  profileMessage,
  handleProfileSubmit,
  isEditing,
  isSubmitting,
}) => {
  return (
    <div className="container mx-auto">
      <Typography variant="h4" className="dark:text-white">
        Vos informations
      </Typography>
      <p className="text-gray-600 dark:text-white">
        Les informations que vous avez renseignées sont affichées ci-dessous.
      </p>

      <div className="my-4">
        <Card className="mx-auto max-w-2xl p-6 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <Typography
              variant="h4"
              color="blue-gray"
              className="dark:text-white"
            >
              Mon Profil
            </Typography>
            <IconButton variant="text" onClick={() => setIsEditing(!isEditing)}>
              <PencilIcon className="h-5 w-5" />
            </IconButton>
          </div>

          {profileMessage?.content && (
            <Alert
              color={profileMessage.type === "success" ? "green" : "red"}
              className="mb-4"
            >
              {profileMessage.content}
            </Alert>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 dark:text-white"
              >
                Prénom
              </Typography>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={
                  !isEditing ? "bg-gray-50 dark:text-white" : "dark:text-white"
                }
              />
            </div>

            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 dark:text-white"
              >
                Nom
              </Typography>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={
                  !isEditing ? "bg-gray-50 dark:text-white" : "dark:text-white"
                }
              />
            </div>

            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 dark:text-white"
              >
                Email
              </Typography>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditing}
                className={
                  !isEditing ? "bg-gray-50 dark:text-white" : "dark:text-white"
                }
              />
            </div>

            {isEditing && (
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                className={`mt-6 dark:bg-white dark:text-black dark:hover:bg-gray-400 ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isSubmitting
                  ? "Mise à jour en cours..."
                  : "Mettre à jour le profil"}
              </Button>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
export default Profile;
