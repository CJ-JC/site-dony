import React from "react";
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
        <Card className="mx-auto max-w-2xl p-6 dark:bg-white/90">
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h4" color="blue-gray">
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
              <Typography variant="small" color="blue-gray" className="mb-2">
                Prénom
              </Typography>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2">
                Nom
              </Typography>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2">
                Email
              </Typography>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            {isEditing && (
              <Button type="submit" className="mt-6" fullWidth>
                Mettre à jour le profil
              </Button>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
export default Profile;
