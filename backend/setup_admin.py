import sys
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import Admin
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def check_table_exists(engine, table_name):
    inspector = inspect(engine)
    return table_name in inspector.get_table_names()

def check_admin_exists(db: Session, username: str):
    try:
        admin = db.query(Admin).filter(Admin.username == username).first()
        return admin
    except Exception as e:
        print(f"Error checking admin: {e}")
        return None

def create_admin_user(
    db: Session,
    username: str,
    password: str,
    full_name: str,
    email: str,
    is_super_admin: bool = True
):
    try:
        existing_admin = db.query(Admin).filter(
            (Admin.username == username) | (Admin.email == email)
        ).first()
        if existing_admin:
            print(f"❌ Admin with username '{username}' or email '{email}' already exists!")
            print(f"   Existing admin ID: {existing_admin.id}")
            print(f"   Existing admin username: {existing_admin.username}")
            update = input("Do you want to update the password? (yes/no): ").strip().lower()
            if update == 'yes':
                password_hash = pwd_context.hash(password)
                existing_admin.password_hash = password_hash
                db.commit()
                print(f"✅ Password updated for admin '{username}'")
                print("\n🔍 Verifying password...")
                if pwd_context.verify(password, existing_admin.password_hash):
                    print("✅ Password verification successful!")
                else:
                    print("❌ Password verification failed!")
            return existing_admin
        print(f"\n🔐 Hashing password for '{username}'...")
        password_hash = pwd_context.hash(password)
        print("🔍 Verifying hashed password...")
        if pwd_context.verify(password, password_hash):
            print("✅ Password hash verified successfully!")
        else:
            print("❌ Password hash verification failed!")
            return None
        new_admin = Admin(
            username=username,
            password_hash=password_hash,
            full_name=full_name,
            email=email,
            is_super_admin=is_super_admin,
            is_active=True
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        print(f"\n✅ Admin user created successfully!")
        print(f"   ID: {new_admin.id}")
        print(f"   Username: {new_admin.username}")
        print(f"   Email: {new_admin.email}")
        print(f"   Super Admin: {new_admin.is_super_admin}")
        print(f"   Active: {new_admin.is_active}")
        return new_admin
    except Exception as e:
        print(f"❌ Error creating admin: {str(e)}")
        import traceback
        print(traceback.format_exc())
        db.rollback()
        return None

def test_admin_login(db: Session, username: str, password: str):
    print(f"\n🧪 Testing login for '{username}'...")
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin:
        print(f"❌ Admin user '{username}' not found in database!")
        return False
    print(f"✅ Admin user found in database")
    print(f"   ID: {admin.id}")
    print(f"   Username: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Active: {admin.is_active}")
    print(f"\n🔐 Verifying password...")
    is_valid = pwd_context.verify(password, admin.password_hash)
    if is_valid:
        print("✅ Password verification successful!")
        return True
    else:
        print("❌ Password verification failed!")
        print(f"   Stored hash: {admin.password_hash[:50]}...")
        return False

def main():
    print("=" * 70)
    print("ADMIN USER SETUP AND VERIFICATION")
    print("=" * 70)
    print("\n1. Checking if 'admins' table exists...")
    if check_table_exists(engine, "admins"):
        print("✅ 'admins' table exists")
    else:
        print("❌ 'admins' table does not exist!")
        print("🔨 Creating all tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created")
    db = SessionLocal()
    try:
        print("\n2. Creating/Updating admin users...")
        admin1 = create_admin_user(
            db=db,
            username="admin",
            password="admin123",
            full_name="System Administrator",
            email="admin@roadsense.ai",
            is_super_admin=True
        )
        admin2 = create_admin_user(
            db=db,
            username="superadmin",
            password="superadmin123",
            full_name="Super Administrator",
            email="superadmin@roadsense.ai",
            is_super_admin=True
        )
        print("\n3. Testing admin logins...")
        print("-" * 70)
        test_admin_login(db, "admin", "admin123")
        print("-" * 70)
        test_admin_login(db, "superadmin", "superadmin123")
        print("\n4. All admins in database:")
        print("-" * 70)
        all_admins = db.query(Admin).all()
        for admin in all_admins:
            print(f"   • {admin.username} ({admin.email}) - Active: {admin.is_active}")
        print("\n" + "=" * 70)
        print("SETUP COMPLETE!")
        print("=" * 70)
        print("\nDefault Credentials:")
        print("   Username: admin")
        print("   Password: admin123")
        print("\n   Username: superadmin")
        print("   Password: superadmin123")
        print("=" * 70)
    except Exception as e:
        print("\n❌ Error: {str(e)}")
        import traceback
        print(traceback.format_exc())
    finally:
        db.close()

if __name__ == "__main__":
    main()
