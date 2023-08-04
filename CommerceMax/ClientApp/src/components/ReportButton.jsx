import React, { useContext, useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  Image,
} from "@react-pdf/renderer";
import { AuthContext } from "../context/AuthContext";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../database/firebase";

const ReportButton = ({ onComplete }) => {
  // CONTEXTO DONDE ESTA GUARDADA LA INFORMACION DEL USUARIO EN SESION
  const userInfo = useContext(AuthContext);
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const stringDay = day.toString();
  const stringMonth = month.toString();
  const stringYear = year.toString();

  const stringHours = hours.toString();
  const stringMinutes = minutes.toString();

  const stringDate = stringDay + "/" + stringMonth + "/" + stringYear;
  const stringHour = stringHours + ":" + stringMinutes;

  const [names, setNames] = useState("");
  const [products, setProducts] = useState([]);
  const [myproducts, setMyproducts] = useState([]);

  const uid = userInfo.currentUser.uid;

  useEffect(() => {
    const obtenerDatos = async () => {
      
      const usersDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(usersDocRef);
      const userInfo = userDocSnap.data();
      setNames(userInfo.userName);

      // TODAS LAS PUBLICACIONES
      const allProductList = [];
      const allProductsQuerySnapshot = await getDocs(
        collection(db, "products")
      );
      allProductsQuerySnapshot.forEach((doc) => {
        allProductList.push({ id: doc.id, ...doc.data() });
      });
      setProducts(allProductList);

      // MIS PUBLICACIONES
      const myProductsList = [];
      const q = query(collection(db, "products"), where("uid", "==", uid));
      const myProductsQuerySnapshot = await getDocs(q);
      myProductsQuerySnapshot.forEach((doc) => {
        myProductsList.push({ id: doc.id, ...doc.data() });
      });
      setMyproducts(myProductsList);
    };
    obtenerDatos();
  }, [uid]);

  const MyDocument = () => (
    <Document>
      <Page style={{ fontFamily: "Helvetica", fontSize: 12, padding: 40 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Image
            src="/img/flor.png"
            alt="Comemerce Max Logo"
            style={{ width: 40, height: 40, margin: "0 auto" }}
          />
        </div>
        <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 10 }}>
          REPORTE DE TODOS LOS PRODUCTOS
        </Text>

        <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}>
          Commerce Max
        </Text>

        <div
          style={{
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
          }}
        >
          <div style={{ margin: "auto", flexDirection: "row" }}>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              TITULO
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              DESCRIPCION
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              PRECIO
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              CATEGORIA
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              CALIFICACION
            </Text>
          </div>
          {products.map((products) => (
            <div style={{ margin: "auto", flexDirection: "row" }}>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {products.title}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {products.description}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {products.price}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {products.category}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {Math.round(products.rating * 10) / 10}
              </Text>
            </div>
          ))}
        </div>

        <div
          break
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Image
            src="/img/flor.png"
            alt="Comemerce Max Logo"
            style={{ width: 40, height: 40, margin: "0 auto" }}
          />
        </div>
        <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 10 }}>
          REPORTE DE MIS PRODUCTOS
        </Text>

        <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}>
          Commerce Max
        </Text>

        <div
          style={{
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
          }}
        >
          <div style={{ margin: "auto", flexDirection: "row" }}>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              TITULO
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              DESCRIPCION
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              PRECIO
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              CATEGORIA
            </Text>
            <Text
              style={{
                width: "20%",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                padding: "10px 0px 10px 0px",
                borderStyle: "solid",
                borderWidth: 1,
                borderLeftWidth: 0,
                borderTopWidth: 0,
              }}
            >
              CALIFICACION
            </Text>
          </div>
          {myproducts.map((myproducts) => (
            <div style={{ margin: "auto", flexDirection: "row" }}>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {myproducts.title}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {myproducts.description}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {myproducts.price}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {myproducts.category}
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  padding: "10px 0px 10px 0px",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                }}
              >
                {Math.round(myproducts.rating * 10) / 10}
              </Text>
            </div>
          ))}
        </div>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginTop: "auto",
          }}
        >
          Generado por: {userInfo.currentUser.displayName || names}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          El dia: {stringDate} a las: {stringHour}
        </Text>
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink
      document={<MyDocument />}
      fileName="ReporteProductosCommerceMax.pdf"
      className="text-red-700 block px-4 py-2 text-sm  hover:bg-gray-900 hover:text-red-500 cursor-pointer"
    >
      {({ loading }) =>
        loading ? "Generando reporte..." : "Descargar reporte"
      }
    </PDFDownloadLink>
  );
};

export default ReportButton;