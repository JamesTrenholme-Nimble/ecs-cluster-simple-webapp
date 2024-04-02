import ec2 = require("aws-cdk-lib/aws-ec2");
import * as ecs from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

import * as alb from "aws-cdk-lib/aws-elasticloadbalancingv2";

export interface albProps {
  vpc: ec2.Vpc;
  service: ecs.FargateService;
}

export class ALB extends Construct {
  constructor(scope: Construct, id: string, props: albProps) {
    super(scope, id);

    // place an application load balancer in front of the fargate service
    const lb = new alb.ApplicationLoadBalancer(this, "ALB", {
      vpc: props.vpc,
      internetFacing: true,
    });

    // attach the lb to the fargate service
    const listener = lb.addListener("Listener", {
      port: 80,
      protocol: alb.ApplicationProtocol.HTTP,
    });

    listener.addTargets("Target", {
      port: 3000,
      protocol: alb.ApplicationProtocol.HTTP,
      targets: [props.service],
    });
  }
}
