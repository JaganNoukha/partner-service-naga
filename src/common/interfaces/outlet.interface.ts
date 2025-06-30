import {
  DocumentVerificationStatus,
  VerificationDocumentType
} from '../enums/outlet.enums';

export interface IOutlet {
  outletId: string;
  outletName: string;
 outlettypeId: string;
  phoneNumber: string;
  outletImageUrl: string;
  outletStatus: string;
  outletAddress: IOutletAddress;
  isDeleted: boolean;
  warehouses: Array<{ warehouseId: string }>;
  verificationDocuments: IVerificationDocument[];
}

export interface IVerificationDocument {
  documentType: VerificationDocumentType;
  value: string;
  verificationStatus?: DocumentVerificationStatus;
}

export interface IOutletAddress {
  streetAddress: string;
  location: IOutletLocation;
}

export interface IOutletLocation {
  type: 'Point';
  coordinates: [number, number];
}