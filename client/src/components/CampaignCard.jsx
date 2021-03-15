import React from "react";
import { Row, Col, Card, Progress } from "antd";
import "antd/dist/antd.css";

export default function CampaignCard({ data }) {
  return (
    <Card
      onClick={() => console.log("hi")}
      loading={!data}
      hoverable
      style={{ width: 230 }}
      bodyStyle={{ padding: 0 }}
    >
      <img
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        height="180"
        width="100%"
        style={{ filter: "brightness(60%)" }}
      />

      <div
        style={{
          position: "absolute",
          top: "20%",
          height: "180",
          width: "100%",
          padding: "5%",
          color: "white",
        }}
      >
        <Row>
          <b>${data.currentDonation}</b>
        </Row>
        <Row>raised from {data.noOfDonors} donors</Row>
        <Row>
          <Progress
            percent={Math.floor(
              (100 * data.currentDonation) / data.targetDonation
            )}
          />
        </Row>
        <Row>
          <Col span={12} style={{ padding: "0" }}>
            <b>
              {Math.floor((100 * data.currentDonation) / data.targetDonation)}%
            </b>{" "}
            of <b>${data.targetDonation}</b>
          </Col>
          <Col span={12}>
            <b>{data.endDate - data.startDate}</b> more days
          </Col>
        </Row>
      </div>
      <Row className="mx-2">
        <p className="font-weight-bold text-left">{data.campaignName}</p>
      </Row>
      <Row className="mx-2">
        <Col span={4}>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            className="rounded-circle img-fluid"
          />
        </Col>
        <Col span={20}>
          <p className="font-weight-light">by {data.charityName}</p>
        </Col>
      </Row>
      <Row className="mx-2">
        <p className="text-left ml-2">{data.description}</p>
      </Row>
    </Card>
  );
}
