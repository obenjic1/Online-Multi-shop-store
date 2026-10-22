package com.bag_shop_api.bag_shop_api.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bag_shop_api.bag_shop_api.Entity.User;
import com.bag_shop_api.bag_shop_api.Enums.Role;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);
    
    long countByRole(Role role);

    long countByRoleAndEnabledTrue(Role role);
    

    long countByRoleAndEnabledFalse(Role role);
    @Query("""
    SELECT u
    FROM User u
    WHERE u.role = :role
      AND u.enabled = true
      AND NOT EXISTS (
          SELECT s.id
          FROM Shop s
          WHERE s.owner.id = u.id
      )
    ORDER BY u.username ASC
""")
List<User> findAvailableAdmins(@Param("role") Role role);
}
