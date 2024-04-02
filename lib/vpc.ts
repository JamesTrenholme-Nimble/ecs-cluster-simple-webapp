import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VPC extends Construct {
  public readonly vpc: ec2.Vpc
  constructor(scope: Construct, id: string) {
    super(scope, id);


    // Create a VPC
    const vpc = new ec2.Vpc(this, "webappVPC", { maxAzs: 2 });

    this.vpc = vpc
  }
}
