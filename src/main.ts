import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Config } from "./configs/config";
import { GenericErrorFilter } from "./filters/generic-error.filter";
import { App } from "./module/app";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(App);
  app.setGlobalPrefix("voucher-pool/api");
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GenericErrorFilter());
  app.enableVersioning({
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("Voucher Pool")
    .setDescription("")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("voucher-pool/api/docs", app, document);
  console.log(`Listening on port ${Config.PORT}`);
  await app.listen(Config.PORT || 3000);
}

bootstrap();
