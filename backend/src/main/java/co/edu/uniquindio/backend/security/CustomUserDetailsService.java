package co.edu.uniquindio.backend.security;

import co.edu.uniquindio.backend.model.AuthUsuario;
import co.edu.uniquindio.backend.repository.AuthUsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AuthUsuarioRepository authUsuarioRepository;

    public CustomUserDetailsService(AuthUsuarioRepository authUsuarioRepository) {
        this.authUsuarioRepository = authUsuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AuthUsuario usuario = authUsuarioRepository.buscarPorUsername(username);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        return new User(
                usuario.getUsername(),
                usuario.getPasswordHash(),
                usuario.isActivo(),
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
        );
    }
}