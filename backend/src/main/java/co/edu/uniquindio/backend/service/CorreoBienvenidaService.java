package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.model.Cliente;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class CorreoBienvenidaService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CorreoBienvenidaService.class);

    private final JavaMailSender mailSender;
    private final boolean correoActivo;
    private final String mailHost;
    private final String mailUsername;
    private final String mailPassword;
    private final String remitente;
    private final String nombreRemitente;

    public CorreoBienvenidaService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${hogarxpress.mail.enabled:false}") boolean correoActivo,
            @Value("${spring.mail.host:}") String mailHost,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${spring.mail.password:}") String mailPassword,
            @Value("${hogarxpress.mail.from:}") String remitente,
            @Value("${hogarxpress.mail.from-name:HogarXpress}") String nombreRemitente) {
        this.mailSender = mailSenderProvider.getIfAvailable();
        this.correoActivo = correoActivo;
        this.mailHost = mailHost;
        this.mailUsername = mailUsername;
        this.mailPassword = mailPassword;
        this.remitente = remitente;
        this.nombreRemitente = nombreRemitente;
    }

    public boolean enviarBienvenida(Cliente cliente, String username) {
        if (!estaConfigurado(cliente)) {
            return false;
        }

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(cliente.getCorreo());
            helper.setFrom(remitente);
            helper.setSubject("Bienvenido a HogarXpress");
            helper.setText(crearTextoPlano(cliente, username), crearHtml(cliente, username));

            mailSender.send(mensaje);
            LOGGER.info("Correo de bienvenida enviado a {}", cliente.getCorreo());
            return true;
        } catch (MailException | MessagingException ex) {
            LOGGER.warn("No se pudo enviar el correo de bienvenida a {}", cliente.getCorreo(), ex);
            return false;
        }
    }

    private boolean estaConfigurado(Cliente cliente) {
        if (!correoActivo) {
            LOGGER.info("Correo de bienvenida omitido porque MAIL_ENABLED=false.");
            return false;
        }

        if (mailSender == null
                || estaVacio(mailHost)
                || estaVacio(mailUsername)
                || estaVacio(mailPassword)
                || estaVacio(remitente)) {
            LOGGER.warn("Correo de bienvenida activo, pero faltan variables SMTP.");
            return false;
        }

        if (cliente == null || estaVacio(cliente.getCorreo())) {
            LOGGER.warn("Correo de bienvenida omitido porque el cliente no tiene correo.");
            return false;
        }

        return true;
    }

    private String crearTextoPlano(Cliente cliente, String username) {
        String nombre = valor(cliente.getNombre(), "cliente");
        String usuario = valor(username, cliente.getCorreo());

        return """
                Hola %s,

                Bienvenido a HogarXpress. Gracias por preferirnos para acompanar tu busqueda inmobiliaria.

                Tu cuenta de cliente ya esta activa. Puedes ingresar con el usuario %s para explorar inmuebles,
                guardar favoritos, solicitar visitas y recibir recomendaciones segun tus preferencias.

                Equipo HogarXpress
                """.formatted(nombre, usuario);
    }

    private String crearHtml(Cliente cliente, String username) {
        String nombre = escaparHtml(valor(cliente.getNombre(), "cliente"));
        String usuario = escaparHtml(valor(username, cliente.getCorreo()));
        String marca = escaparHtml(nombreRemitente);

        return """
                <!doctype html>
                <html>
                <body style="margin:0;padding:0;background:#15121b;font-family:Arial,sans-serif;color:#f8f4ff;">
                  <div style="max-width:640px;margin:0 auto;padding:32px;">
                    <div style="background:#211a2c;border:1px solid #4b2d72;border-radius:18px;padding:28px;">
                      <p style="margin:0 0 12px;color:#c4a8ff;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">%s</p>
                      <h1 style="margin:0 0 16px;font-size:28px;color:#ffffff;">Bienvenido, %s</h1>
                      <p style="font-size:16px;line-height:1.6;color:#d8cfe5;">
                        Gracias por preferirnos para acompanar tu busqueda inmobiliaria. Tu cuenta de cliente ya esta activa.
                      </p>
                      <div style="margin:22px 0;padding:18px;border-radius:14px;background:#2c2338;color:#f3eaff;">
                        Usuario: <strong>%s</strong>
                      </div>
                      <p style="font-size:15px;line-height:1.6;color:#bfb2ce;">
                        Desde HogarXpress puedes explorar inmuebles, guardar favoritos, solicitar visitas y recibir recomendaciones segun tus preferencias.
                      </p>
                      <p style="margin:28px 0 0;color:#ffffff;font-weight:700;">Equipo HogarXpress</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(marca, nombre, usuario);
    }

    private String valor(String valor, String respaldo) {
        if (valor == null || valor.isBlank()) {
            return respaldo;
        }
        return valor.trim();
    }

    private boolean estaVacio(String valor) {
        return valor == null || valor.isBlank();
    }

    private String escaparHtml(String valor) {
        if (valor == null) {
            return "";
        }

        return valor
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
