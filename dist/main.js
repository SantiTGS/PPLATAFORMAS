"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./users/modules/app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const port = process.env.PORT || 4000;
    await app.listen(4000, '0.0.0.0');
    console.log(`🚀 API corriendo en http://localhost:4000/api`);
    console.log(`📱 Acceso móvil: http://10.182.51.38:4000/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map