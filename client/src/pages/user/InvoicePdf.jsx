import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { ArrowBack } from "@mui/icons-material";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "@/widgets/utils/CheckAuthStatus";

const InvoicePdf = () => {
  const { state } = useLocation();
  const { purchase } = state || {};
  const [userDetail, setUserDetail] = useState(null);
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (purchase) {
      setUserDetail(purchase.user);
      setPurchaseDetails(purchase);
    }
  }, [purchase]);

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch]);

  useEffect(() => {
    if (
      !authLoading &&
      (!isLoggedIn || !user || (user.role !== "admin" && user.role !== "user"))
    ) {
      setPurchaseDetails(null);
      setUserDetail(null);
      navigate("/sign-in");
    }
  }, [authLoading, isLoggedIn, user, navigate]);

  const openPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 10;
    let currentY = 20;

    // Titre de la facture
    doc
      .setFontSize(20)
      .setFont("helvetica", "bold")
      .text("Facture", marginLeft, currentY);
    currentY += 10;

    // Informations de la facture
    doc
      .setFontSize(12)
      .setFont("helvetica", "normal")
      .text(
        `Numéro de Facture : #${purchase?.id.toString().padStart(6, "0")}`,
        marginLeft,
        currentY,
      );
    currentY += 6;
    doc.text(
      `Date : ${new Date(purchase?.createdAt).toLocaleDateString("fr-FR")}`,
      marginLeft,
      currentY,
    );
    currentY += 10;

    // Informations du client
    doc
      .setFont("helvetica", "bold")
      .text(
        `Facturé à : ${userDetail?.firstName} ${userDetail?.lastName}`,
        marginLeft,
        currentY,
      );
    currentY += 6;
    doc
      .setFont("helvetica", "normal")
      .text(`Email : ${userDetail?.email}`, marginLeft, currentY);
    currentY += 15;

    // Table header
    doc.setFont("helvetica", "bold");
    doc.text("Produit", marginLeft, currentY);
    doc.text("Montant HT", marginLeft + 90, currentY);
    doc.text("TVA (20%)", marginLeft + 130, currentY);
    doc.text("Montant TTC", marginLeft + 170, currentY);
    currentY += 6;
    doc.line(marginLeft, currentY, marginLeft + 190, currentY); // Ligne de séparation
    currentY += 6;

    // Informations produit
    const montantHT = (purchase.amount / 1.2).toFixed(2);
    const montantTVA = (purchase.amount - purchase.amount / 1.2).toFixed(2);
    const montantTTC = purchase.amount;

    const productTitle =
      purchase.itemType === "course"
        ? purchase.course?.title
        : purchase.masterclass?.title;

    doc.setFont("helvetica", "normal");
    doc.text(productTitle, marginLeft, currentY);
    doc.text(`${montantHT}€`, marginLeft + 90, currentY);
    doc.text(`${montantTVA}€`, marginLeft + 130, currentY);
    doc.text(`${montantTTC}€`, marginLeft + 170, currentY);
    currentY += 10;

    // Informations de l’entreprise
    currentY = 260;
    doc.setFontSize(10);
    doc
      .setFont("helvetica", "bold")
      .text("Informations de l'entreprise", marginLeft, currentY);
    currentY += 6;
    doc.setFont("helvetica", "normal");
    doc.text("Donymsic", marginLeft, currentY);
    doc.text(
      "Adresse : 123 Rue Exemple, 75001 Paris, France",
      marginLeft,
      currentY + 5,
    );
    doc.text(
      "SIRET : 123 456 789 00012 | TVA : FR 12 3456789012",
      marginLeft,
      currentY + 10,
    );
    doc.text(
      "Email : contact@donymsic.fr | Téléphone : +33 1 23 45 67 89",
      marginLeft,
      currentY + 15,
    );

    // Ouvrir le PDF
    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");
  };

  return (
    <div className="h-auto md:h-screen">
      <div className="mx-auto my-20 max-w-3xl rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Facture</h1>
            <p className="text-gray-600">
              Numéro de Facture : #
              {purchase?.id.toString().padStart(6, "0") || "N/A"}
            </p>
            <p className="text-gray-600">
              Date : {new Date(purchase?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">
              Facturé à {userDetail?.firstName} {userDetail?.lastName}
            </h2>
            <p className="text-gray-600">Email : {userDetail?.email}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-600">Produit</th>
                <th className="px-4 py-2 text-right text-gray-600">
                  Montant HT
                </th>
                <th className="px-4 py-2 text-right text-gray-600">
                  TVA (20%)
                </th>
                <th className="px-4 py-2 text-right text-gray-600">
                  Montant TTC
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 text-gray-700">
                  {purchase?.itemType === "course"
                    ? purchase.course?.title
                    : purchase.masterclass?.title}
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {(purchase?.amount / 1.2).toFixed(2)}€
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {(purchase?.amount - purchase?.amount / 1.2).toFixed(2)}€
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {purchase?.amount}€
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="h-80"></div>

        <div className="my-6">
          <div className="border-t pt-4">
            <h2 className="text-md font-semibold text-gray-800">
              Informations de l'entreprise
            </h2>
            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:justify-between">
              <div className="flex flex-col">
                <p className="text-gray-600">Donymsic</p>
                <p className="text-gray-600">
                  <strong>Adresse : </strong>123 Rue Exemple
                </p>
                <p className="text-gray-600">75001 Paris, France</p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600">
                  <strong>Siret :</strong> 123 456 789 00012
                </p>
                <p className="text-gray-600">
                  <strong>Tva :</strong> FR12345678901
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="mt-6 flex items-center justify-center space-x-3">
          <Link
            to={
              user && user.role === "admin" ? "/administrator" : "/user/account"
            }
          >
            <Button variant="outlined" color="gray" size="sm">
              <ArrowBack />
              Retour
            </Button>
          </Link>
          <Button onClick={openPDF} variant="gradient" className="text-white">
            Ouvrir la facture en PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePdf;
