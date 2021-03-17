import React from "react";
import { Row, Col, Tabs, Card, Typography, Avatar, Progress } from "antd";
import "antd/dist/antd.css";
import HomePageBanner from "../assets/homepagebanner.jpg";
import CampaignCard from "../components/CampaignCard";

const { TabPane } = Tabs;
const { Title } = Typography;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: "Ongoing",
      isLoading: false,
    };
  }

  handleMenuChange = (e) => {
    console.log("click", e);
    this.setState({ menu: e.key });
  };

  campaignExample = {
    currentDonation: 95474,
    targetDonation: 99999,
    noOfDonors: 848,
    startDate: 10,
    endDate: 30,
    campaignName: "Help the vulnerable in a crisis..to stay",
    charityName: "JL KAH for Samaritans of Singapore",
    description:
      "It is very sad when people, in the depths of despair, can no longer find reason or hope to live on and think of ending their................",
  };

  render() {
    return (
      <div>
        <Row justify="center">
          <Col span={24}>
            <Card bordered={false} bodyStyle={{ padding: "0" }}>
              <img src={HomePageBanner} height="250" width="100%"></img>
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "12%",
                }}
              >
                <Title style={{ color: "white" }}>Give the Gift Today!</Title>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "12%",
                }}
              >
                <Title style={{ color: "white" }} level={3}>
                  Every little bit counts!
                </Title>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={18} offset={3}>
            <Title level={3} style={{ textAlign: "left" }}>
              Campaigns
            </Title>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={18}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Ongoing" key="1">
                <Row justify="center" gutter={32}>
                  <Col span={8}>
                    <CampaignCard data={this.campaignExample} />
                  </Col>
                  <Col span={8}></Col>
                  <Col span={8}></Col>
                </Row>
                <Row justify="center"></Row>
                <Row justify="center"></Row>
              </TabPane>
              <TabPane tab="Past" key="2">
                Content of Tab Pane 2
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
